import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import gsap from "gsap";
import { VESSEL_SECTIONS, VesselSection } from "../types";

// Helper: creates a custom procedural high-quality environmental gradient map for gorgeous physical reflection/gloss mapping
function createCustomEnvironmentMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Sleek dark-onyx/charcoal studio background
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0.0, "#1c1917"); // Dark stone overhead
    skyGradient.addColorStop(0.35, "#09090b"); // Sleek onyx void
    skyGradient.addColorStop(0.5, "#292524"); // Soft horizon ambient focus
    skyGradient.addColorStop(0.65, "#09090b"); // Dark reflective floor segment
    skyGradient.addColorStop(1.0, "#030712"); // Midnight ocean base
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Highly intense specular light point for sharp gloss reflection spots
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(140, 60, 15, 0, Math.PI * 2);
    ctx.fill();

    // Multiple glowing white studio neon bars to cast elegant elongated mirror reflections
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(290, 15, 110, 18);
    ctx.fillRect(40, 130, 140, 6);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; // Clean, natural white studio tube light
    ctx.fillRect(170, 35, 70, 8);
  }

  const canvasTexture = new THREE.CanvasTexture(canvas);
  canvasTexture.mapping = THREE.EquirectangularReflectionMapping;
  
  const envMap = pmremGenerator.fromEquirectangular(canvasTexture).texture;
  
  canvasTexture.dispose();
  pmremGenerator.dispose();

  return envMap;
}

class DSU {
  parent: Map<string, string> = new Map();

  find(x: string): string {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      return x;
    }
    let r = x;
    while (this.parent.get(r) !== r) {
      r = this.parent.get(r)!;
    }
    let curr = x;
    while (curr !== r) {
      let next = this.parent.get(curr)!;
      this.parent.set(curr, r);
      curr = next;
    }
    return r;
  }

  union(x: string, y: string) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX !== rootY) {
      this.parent.set(rootX, rootY);
    }
  }
}

const getVertexKey = (x: number, y: number, z: number) => {
  return `${Math.round(x * 100)},${Math.round(y * 100)},${Math.round(z * 100)}`;
};

interface ThreeCanvasProps {
  currentSectionIndex: number;
  customModelFile: File | null;
  onModelLoadedStatus: (success: boolean, name?: string) => void;
  hullColor: string;
  deckColor: string;
  glassColor: string;
  selectedModelUrl: string | null;
  lightingTheme?: "cyber" | "sunset" | "studio";
}

export default function ThreeCanvas({
  currentSectionIndex,
  customModelFile,
  onModelLoadedStatus,
  hullColor,
  deckColor,
  glassColor,
  selectedModelUrl,
  lightingTheme = "sunset"
}: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep references to Three.js objects for animate loop and updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shipGroupRef = useRef<THREE.Group | null>(null);
  const loadedShipRef = useRef<THREE.Group | null>(null);
  const radarRef = useRef<THREE.Mesh | null>(null);
  const propellersRef = useRef<THREE.Mesh[]>([]);
  const waterPlaneRef = useRef<THREE.Mesh | null>(null);

  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const keyLightOverheadRef = useRef<THREE.DirectionalLight | null>(null);
  const frontLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  
  // Technical pointers / markers
  const markersRef = useRef<{ [key: string]: THREE.Group }>({});

  // Smooth camera targets that GSAP will tween, and render loop will interpolate towards.
  // We initialize the target position very far away to establish a majestic opening dolly-in sweeping view.
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(130, 45, 90));
  const cameraTargetLook = useRef<THREE.Vector3>(new THREE.Vector3(4.5, -0.5, -1.5));
  const cameraCurrentLook = useRef<THREE.Vector3>(new THREE.Vector3(4.5, -0.5, -1.5));

  // Inactivity / Idle States for slow cinematic camera rotation after 30 seconds
  const currentSectionIndexRef = useRef(currentSectionIndex);
  const isIdleRef = useRef(false);
  const idleAngleRef = useRef(0);
  const idleAngleStartRef = useRef<number | null>(null);
  const idleTimerRef = useRef<any>(null);

  // Current interactive loading/error states in 3D
  const [loadingModel, setLoadingModel] = useState<boolean>(false);
  const [isUsingCustom, setIsUsingCustom] = useState<boolean>(false);

  // Initialize Scene, Lights, Water and Fallback Ship
  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0d0e12"); // Soft luxurious tech-slate background (makes the black mirror highly distinguishable)
    scene.fog = new THREE.FogExp2("#0d0e12", 0.007); // Soft fog so the horizon dissolves beautifully
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    // Initial hero camera position starting extremely far for a sweeping cinematic zoom-in entrance
    camera.position.set(130, 45, 90);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Set photographic tone mapping
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15; // Slightly brighter for glorious gloss highlights
    rendererRef.current = renderer;

    // Generate beautiful custom procedural environmental map for reflection rendering
    const envMap = createCustomEnvironmentMap(renderer);
    scene.environment = envMap;

    // 4. Lights: High contrast Dark-Studio spotlighting to make the model details pop
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.15); // Suppressed fill to lock in deep black values
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Directional Spot Light (Overhead bright light)
    const dirLight = new THREE.DirectionalLight("#ffffff", 1.8);
    dirLight.position.set(-20, 35, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    const shadowSize = 35;
    dirLight.shadow.camera.left = -shadowSize;
    dirLight.shadow.camera.right = shadowSize;
    dirLight.shadow.camera.top = shadowSize;
    dirLight.shadow.camera.bottom = -shadowSize;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Key Light directly from above the yacht for glossy deck curves
    const keyLightOverhead = new THREE.DirectionalLight("#ffffff", 1.5);
    keyLightOverhead.position.set(0, 45, 0);
    scene.add(keyLightOverhead);
    keyLightOverheadRef.current = keyLightOverhead;

    // Powerful front highlight to illuminate bow and side details clearly
    const frontLight = new THREE.DirectionalLight("#ffffff", 1.4);
    frontLight.position.set(35, 12, 12);
    scene.add(frontLight);
    frontLightRef.current = frontLight;

    // Natural studio key fill/bounce light from below to emphasize the mirror floor reflection
    const bounceLightL = new THREE.DirectionalLight("#ffffff", 0.65);
    bounceLightL.position.set(15, -20, 15);
    scene.add(bounceLightL);

    const bounceLightR = new THREE.DirectionalLight("#ffffff", 0.45);
    bounceLightR.position.set(-15, -20, -15);
    scene.add(bounceLightR);

    // Extreme sharp Rim light from rear to carve out silhouettes from pitch black background
    const rimLight = new THREE.DirectionalLight("#ffffff", 2.25);
    rimLight.position.set(30, 15, -30);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // 5. Beautiful Reflective Black Mirror Ground and Shadow overlay
    const mirrorGeo = new THREE.PlaneGeometry(600, 600);
    const groundMirror = new Reflector(mirrorGeo, {
      clipBias: 0.003,
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0x1d1e22 // Sleek dark charcoal mirror tone that retains reflections elegantly
    });
    groundMirror.rotation.x = -Math.PI / 2;
    groundMirror.position.y = -6.0; // Place it below the yacht's lower body to reflect beautifully
    scene.add(groundMirror);

    // Dynamic Shadow overlay for physical realism on top of the reflection
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.75 });
    const shadowPlate = new THREE.Mesh(mirrorGeo, shadowMat);
    shadowPlate.rotation.x = -Math.PI / 2;
    shadowPlate.position.y = -5.98;
    shadowPlate.receiveShadow = true;
    scene.add(shadowPlate);

    // Since wireframe is removed, initialize ref to null
    waterPlaneRef.current = null;

    // 6. Main Ship Group holder
    const mainShipGroup = new THREE.Group();
    scene.add(mainShipGroup);
    shipGroupRef.current = mainShipGroup;

    // 7. Create technical spec markers in 3D
    createTechnicalMarkers(scene);

    // Fade in the actual 3D scene canvas majestically as the WebGL engine initializes
    gsap.fromTo(
      canvasRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 3.0, delay: 0.15, ease: "power2.out" }
    );

    // 9. Resize Handling
    const handleResize = () => {
      if (!canvasRef.current || !camera || !renderer) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 10. Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Subtle rotation and bobbing to ship to simulate gentle oceanic wave state
      if (mainShipGroup) {
        // Very slow, luxury swell bobbing and roll
        mainShipGroup.position.y = Math.sin(elapsedTime * 0.45) * 0.12 - 0.2;
        mainShipGroup.rotation.z = Math.sin(elapsedTime * 0.35) * 0.008; // Roll
        mainShipGroup.rotation.x = Math.cos(elapsedTime * 0.25) * 0.005; // Pitch
      }

      // Rotate radar wings
      if (radarRef.current) {
        radarRef.current.rotation.y = elapsedTime * 1.5;
      }

      // Spin propellers at the stern
      propellersRef.current.forEach((prop, idx) => {
        const speed = idx === 0 ? 5 : -5;
        prop.rotation.x += elapsedTime * 0.01 * speed;
      });

      // Technical markers floating / pulsing effects
      Object.keys(markersRef.current).forEach((key) => {
        const marker = markersRef.current[key];
        if (marker && marker.visible) {
          const floatingOffset = Math.sin(elapsedTime * 2.0 + (key === "hull" ? 0 : 1.5)) * 0.18;
          // Apply float offset to the floating tip sphere, not entire model
          const sphereTip = marker.getObjectByName("tip");
          if (sphereTip) {
            sphereTip.position.y = floatingOffset;
          }
        }
      });

      // Butter-smooth camera position interpolation
      if (camera) {
        if (isIdleRef.current) {
          // Increment angle slowly over time for majestic slow cinematic speed
          idleAngleRef.current += 0.0006;
          
          const targetLook = cameraTargetLook.current;
          const section = VESSEL_SECTIONS[currentSectionIndexRef.current];
          if (section) {
            const dx = section.cameraPos.x - section.cameraLookAt.x;
            const dz = section.cameraPos.z - section.cameraLookAt.z;
            const radius = Math.sqrt(dx * dx + dz * dz);
            const baseHeight = section.cameraPos.y;

            if (idleAngleStartRef.current === null) {
              idleAngleStartRef.current = Math.atan2(dz, dx);
              idleAngleRef.current = 0;
            }

            const currentAngle = idleAngleStartRef.current + idleAngleRef.current;

            // Direct smooth orbital coordinates
            const orbitX = section.cameraLookAt.x + Math.cos(currentAngle) * radius;
            const orbitZ = section.cameraLookAt.z + Math.sin(currentAngle) * radius;

            cameraTargetPos.current.x = orbitX;
            cameraTargetPos.current.z = orbitZ;
            // Generates an elegant floating vertical wave to accentuate visual style
            cameraTargetPos.current.y = baseHeight + Math.sin(idleAngleRef.current * 1.8) * 1.5;
          }
        }

        camera.position.lerp(cameraTargetPos.current, 0.045); // Slower linear interpolation yields ultimate smoothness!
        cameraCurrentLook.current.lerp(cameraTargetLook.current, 0.045);
        camera.lookAt(cameraCurrentLook.current);
      }

      renderer.render(scene, camera);
    };

    animate();

      // Clean up
      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        envMap.dispose();
        if (loadedShipRef.current) {
          disposeHierarchy(loadedShipRef.current);
        }
      };
  }, []);

  // Handle external / uploaded .glb selection
  useEffect(() => {
    if (!customModelFile) return;
    loadCustomModel(customModelFile);
  }, [customModelFile]);

  // Pre-defined configs for scale and offset corrections of the specific ship models
  const MODEL_CONFIGS: { [key: string]: { scale: number; offsetY: number; rotateY?: number } } = {
    "/assets/Luxuryyacht.glb": { scale: 32, offsetY: 0.8, rotateY: 0 },
    "/assets/Containership.glb": { scale: 34, offsetY: 0.6, rotateY: 0 },
    "/assets/Warship.glb": { scale: 32, offsetY: 0.8, rotateY: 0 }
  };

  // Handle pre-defined model URL selection
  useEffect(() => {
    // If a custom local file is uploaded, skip the dropdown URL selection
    if (customModelFile) return;

    const targetUrl = selectedModelUrl || "/assets/Luxuryyacht.glb";

    const fileName = targetUrl.split("/").pop() || "Yacht";
    const displayName = fileName.replace(".glb", "").replace(/([A-Z])/g, " $1").trim();
    loadGLBModel(targetUrl, displayName);
  }, [selectedModelUrl, customModelFile]);

  // Sync section index reference
  useEffect(() => {
    currentSectionIndexRef.current = currentSectionIndex;
  }, [currentSectionIndex]);

  // Function to return camera back to active section's position smoothly
  const restoreCamera = () => {
    const section = VESSEL_SECTIONS[currentSectionIndexRef.current];
    if (!section) return;

    gsap.killTweensOf(cameraTargetPos.current);
    gsap.killTweensOf(cameraTargetLook.current);

    gsap.to(cameraTargetPos.current, {
      x: section.cameraPos.x,
      y: section.cameraPos.y,
      z: section.cameraPos.z,
      duration: 1.8,
      ease: "power2.out"
    });

    gsap.to(cameraTargetLook.current, {
      x: section.cameraLookAt.x,
      y: section.cameraLookAt.y,
      z: section.cameraLookAt.z,
      duration: 2.0,
      ease: "power2.out"
    });
  };

  // Activity Detector & Inactivity Timer
  useEffect(() => {
    const handleActivity = () => {
      // Only handle restore if we were indeed idling on the starting position
      if (isIdleRef.current) {
        isIdleRef.current = false;
        if (currentSectionIndexRef.current === 0) {
          restoreCamera();
        }
      }

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      // Only schedule idle rotation if we are currently on the overview / starting position (0)
      if (currentSectionIndexRef.current === 0) {
        idleTimerRef.current = setTimeout(() => {
          isIdleRef.current = true;
          idleAngleStartRef.current = null;
          idleAngleRef.current = 0;
        }, 30000); // Trigger slow orbit after 30 seconds of absolute silence
      }
    };

    // Attach to dynamic user events
    const events = ["mousedown", "mousemove", "keydown", "touchstart", "wheel", "scroll"];
    events.forEach((evt) => {
      window.addEventListener(evt, handleActivity, { passive: true });
    });

    // Initialize the primary timeout ONLY if we are at the starting position
    if (currentSectionIndexRef.current === 0) {
      idleTimerRef.current = setTimeout(() => {
        isIdleRef.current = true;
        idleAngleStartRef.current = null;
        idleAngleRef.current = 0;
      }, 30000);
    }

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleActivity);
      });
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  // Handle GSAP Camera Transition when active Section transforms
  useEffect(() => {
    const section = VESSEL_SECTIONS[currentSectionIndex];
    if (!section) return;

    // Reset idle timers on section slide triggers
    if (isIdleRef.current) {
      isIdleRef.current = false;
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Only set the inactivity timer if the active view is the starting position
    if (currentSectionIndex === 0) {
      idleTimerRef.current = setTimeout(() => {
        isIdleRef.current = true;
        idleAngleStartRef.current = null;
        idleAngleRef.current = 0;
      }, 30000);
    }

    // Use GSAP to animate our TARGET camera and lookAt variables smoothly,
    // which our render loop will pick up and continuously ease towards.
    // This double-interpolation guarantees butter-smooth frame pans.
    gsap.to(cameraTargetPos.current, {
      x: section.cameraPos.x,
      y: section.cameraPos.y,
      z: section.cameraPos.z,
      duration: 2.2,
      ease: "power2.out"
    });

    gsap.to(cameraTargetLook.current, {
      x: section.cameraLookAt.x,
      y: section.cameraLookAt.y,
      z: section.cameraLookAt.z,
      duration: 2.5,
      ease: "power2.out"
    });

    // Toggle specific technical 3D indicators depending on the active stage relative location
    updateTechnicalIndicators(section.id);

  }, [currentSectionIndex]);

  // Handle live material styling reactive updates
  useEffect(() => {
    if (!sceneRef.current) return;

    sceneRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if (mat.name === "HullWhite") {
              const physMat = mat as THREE.MeshPhysicalMaterial;
              physMat.color.set(hullColor);
            }
            if (mat.name === "TeakDeck") {
              const stdMat = mat as THREE.MeshStandardMaterial;
              stdMat.color.set(deckColor);
            }
            if (mat.name === "ReflectiveGlass") {
              const physMat = mat as THREE.MeshPhysicalMaterial;
              physMat.color.set(glassColor);
            }
          });
        }
      }
    });
  }, [hullColor, deckColor, glassColor]);

  // Handle live dynamic ambient & studio environmental lighting changes smoothly with GSAP transitions
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Set configuration variables for selected theme
    let bgColor = "#0d0e12";
    let ambientColor = "#ffffff";
    let ambientIntensity = 0.15;
    let mainColor = "#ffffff";
    let accentColor = "#ffffff";
    let rimColor = "#ffffff";

    if (lightingTheme === "sunset") {
      bgColor = "#160f0c";
      ambientColor = "#fed7aa"; // Soft orange sunset glow background
      ambientIntensity = 0.35;
      mainColor = "#f97316";    // Flame orange overhead
      accentColor = "#f43f5e";  // Rose hue cabin details
      rimColor = "#fbbf24";     // Warm gold backlights
    } else if (lightingTheme === "studio") {
      bgColor = "#18181b";      // Cold titanium dark gray studio background
      ambientColor = "#e4e4e7";
      ambientIntensity = 0.28;
      mainColor = "#f4f4f5";    // Solid white main light
      accentColor = "#a1a1aa";  // Slate overhead key light
      rimColor = "#ffffff";     // Bright crisp silhouette rim highlights
    } else {
      // Default / "cyber" (Original design style)
      bgColor = "#0d0e12";
      ambientColor = "#ffffff";
      ambientIntensity = 0.15;
      mainColor = "#e0f2fe";    // Light blue main light
      accentColor = "#06b6d4";  // Cyber cyan highlights
      rimColor = "#ff5000";     // Fiery hot orange outline highlight
    }

    // Morph background and fog color seamlessly
    const bgObj = { color: scene.background ? (scene.background as THREE.Color).getHexString() : "0c0a09" };
    gsap.killTweensOf(bgObj);
    gsap.to(bgObj, {
      color: bgColor.replace("#", ""),
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        scene.background = new THREE.Color(`#${bgObj.color}`);
        if (scene.fog) {
          (scene.fog as THREE.FogExp2).color.set(`#${bgObj.color}`);
        }
      }
    });

    // Fade light intensities and morph colors
    if (ambientLightRef.current) {
      gsap.killTweensOf(ambientLightRef.current);
      gsap.killTweensOf(ambientLightRef.current.color);
      gsap.to(ambientLightRef.current, {
        intensity: ambientIntensity,
        duration: 1.4,
        ease: "power2.out"
      });
      gsap.to(ambientLightRef.current.color, {
        r: new THREE.Color(ambientColor).r,
        g: new THREE.Color(ambientColor).g,
        b: new THREE.Color(ambientColor).b,
        duration: 1.4,
        ease: "power2.out"
      });
    }

    if (dirLightRef.current) {
      gsap.killTweensOf(dirLightRef.current.color);
      gsap.to(dirLightRef.current.color, {
        r: new THREE.Color(mainColor).r,
        g: new THREE.Color(mainColor).g,
        b: new THREE.Color(mainColor).b,
        duration: 1.4,
        ease: "power2.out"
      });
    }

    if (keyLightOverheadRef.current) {
      gsap.killTweensOf(keyLightOverheadRef.current.color);
      gsap.to(keyLightOverheadRef.current.color, {
        r: new THREE.Color(accentColor).r,
        g: new THREE.Color(accentColor).g,
        b: new THREE.Color(accentColor).b,
        duration: 1.4,
        ease: "power2.out"
      });
    }

    if (frontLightRef.current) {
      gsap.killTweensOf(frontLightRef.current.color);
      gsap.to(frontLightRef.current.color, {
        r: new THREE.Color(mainColor).r,
        g: new THREE.Color(mainColor).g,
        b: new THREE.Color(mainColor).b,
        duration: 1.4,
        ease: "power2.out"
      });
    }

    if (rimLightRef.current) {
      gsap.killTweensOf(rimLightRef.current.color);
      gsap.to(rimLightRef.current.color, {
        r: new THREE.Color(rimColor).r,
        g: new THREE.Color(rimColor).g,
        b: new THREE.Color(rimColor).b,
        duration: 1.4,
        ease: "power2.out"
      });
    }

  }, [lightingTheme]);

  // Helper: check default asset existence `/assets/ship.glb` and load it if response is successful
  const checkAndLoadDefaultAsset = async () => {
    try {
      const response = await fetch("/assets/ship.glb", { method: "HEAD" });
      if (response.ok) {
        loadGLBModel("/assets/ship.glb", "Default ship.glb");
      }
    } catch {
      // Gracefully ignore. Procedural vessel is active by default.
    }
  };

  // Helper: load model via URL
  const loadGLBModel = (url: string, name: string) => {
    if (!sceneRef.current || !shipGroupRef.current) return;

    setLoadingModel(true);
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    loader.setDRACOLoader(dracoLoader);
    
    loader.load(
      url,
      (gltf) => {
        // Success
        setLoadingModel(false);
        setIsUsingCustom(true);
        onModelLoadedStatus(true, name);
        
        // Remove prior loaded custom model if present
        if (loadedShipRef.current) {
          shipGroupRef.current?.remove(loadedShipRef.current);
          disposeHierarchy(loadedShipRef.current);
        }

        const model = gltf.scene;
        
        // Ensure child matrix calculations are up-to-date
        model.updateMatrixWorld(true);

        // Center loaded model and compute bounding size based purely on visible meshes
        const box = new THREE.Box3();
        let hasMeshes = false;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            
            // Skip helper elements, cameras, lights, and other elements that inflate bounds incorrectly
            const mName = (mesh.name || "").toLowerCase();
            if (mName.includes("helper") || mName.includes("camera") || mName.includes("light") || mName.includes("sun") || mName.includes("grid")) {
              return;
            }

            // Verify visibility of mesh itself and all its ancestor parents
            let isVisible = true;
            let currentPath: THREE.Object3D | null = mesh;
            while (currentPath) {
              if (!currentPath.visible) {
                isVisible = false;
                break;
              }
              currentPath = currentPath.parent;
            }
            if (!isVisible) return;

            const geom = mesh.geometry;
            if (geom) {
              if (!geom.boundingBox) geom.computeBoundingBox();
              const meshBox = geom.boundingBox!.clone();
              meshBox.applyMatrix4(mesh.matrixWorld);
              box.union(meshBox);
              hasMeshes = true;
            }
          }
        });

        if (!hasMeshes) {
          box.setFromObject(model);
        }

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Nest model local transformation inside an innerGroup to scale and rotate seamlessly around its true visual center
        const innerGroup = new THREE.Group();
        innerGroup.add(model);
        model.position.copy(center).multiplyScalar(-1);

        // Get config override
        const config = MODEL_CONFIGS[url] || { scale: 30, offsetY: 0, rotateY: 0 };
        
        // Auto-orient: if length along Z is greater than X, rotate 90 degrees around Y-axis to align with sections camera paths
        let yawCorrection = 0;
        if (size.z > size.x) {
          yawCorrection = Math.PI / 2;
          const temp = size.x;
          size.x = size.z;
          size.z = temp;
        }

        // Compute scale target
        const scaleFactor = config.scale / Math.max(size.x, size.y, size.z);
        innerGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Apply visual yaw and translational offsets
        innerGroup.rotation.y = yawCorrection + (config.rotateY || 0);
        innerGroup.position.y += config.offsetY;

        // Ensure shadow support on imported asset and elevate material properties
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            // Apply upscale deluxe physically-correct details to materials if missing
            if (mesh.material) {
              const originalMat = mesh.material as THREE.MeshStandardMaterial;
              const matName = (originalMat.name || "").toLowerCase();
              const meshName = (mesh.name || "").toLowerCase();

              const isContainership = url.toLowerCase().includes("containership") || name.toLowerCase().includes("container");
              const isWarship = url.toLowerCase().includes("warship") || name.toLowerCase().includes("war");

              // Heuristics to classify materials for customization colors across different models
              let isGlass = matName.includes("glass") || matName.includes("window") || matName.includes("windshield") || matName.includes("reflective blue") || meshName.includes("glass") || meshName.includes("window");
              let isDeck = matName.includes("deck") || matName.includes("wood") || matName.includes("teak") || matName.includes("timber") || meshName.includes("deck") || meshName.includes("wood");
              let isHull = matName.includes("hull") || matName.includes("body") || matName.includes("color-1") || matName.includes("skin") || meshName.includes("hull") || meshName.includes("body");

              // Specific defaults if no clear name
              if (matName === "color-1") isHull = true;
              if (matName === "color-2") isDeck = true; 

              // Flag on Warship (specifically targeting the Strong_Azure and Yellow materials of the mast/bow flag)
              const isFlag = isWarship && (
                meshName.includes("flag") || meshName.includes("banner") || meshName.includes("jack") ||
                matName.includes("flag") || matName.includes("banner") ||
                matName.includes("strong_azure") || matName.includes("yellow")
              );

              // Container on Containership (exclude hull or deck elements to preserve outline integrity)
              const isContainer = isContainership && !isHull && !isDeck && (
                meshName.includes("container") || meshName.includes("cargo") || meshName.includes("box") || meshName.includes("crate") || meshName.includes("cube") || meshName.includes("stack") ||
                matName.includes("container") || matName.includes("cargo") || matName.includes("box") || matName.includes("crate") || matName.includes("stack")
              );

              if (isFlag) {
                // Beautiful vibrant flat orange fabric color for the flag in front of the warship
                const flagMat = new THREE.MeshPhysicalMaterial({
                  color: new THREE.Color("#ff5000"), // Radiant bright premium flat orange
                  roughness: 0.95, // Matte fabric appearance
                  metalness: 0.0,
                  clearcoat: 0.0,
                  side: THREE.DoubleSide, // Ensure visibility from both sides of the flag
                  name: "WarshipFlagFlatOrange"
                });
                mesh.material = flagMat;
              } else if (isContainer) {
                // Convert cargo mesh geometry to non-indexed so we can color individual containers/groups of triangles independently
                const geometry = mesh.geometry.clone().toNonIndexed();
                const posAttr = geometry.attributes.position;
                if (posAttr) {
                  const count = posAttr.count;
                  const colors = new Float32Array(count * 3);

                  // Spectrum of industrial shipping container colors
                  const containerColors = [
                    "#e63946", // Rust crimson
                    "#1d3557", // Deep navy blue
                    "#457b9d", // Steel blue
                    "#2a9d8f", // High-seas teal green
                    "#f4a261", // Warning industrial amber
                    "#e76f51", // Salmon terracotta
                    "#3a506b", // Cargo slate grey
                    "#9b59b6", // Amethyst deep purple
                    "#f1c40f", // Warning warning yellow
                    "#16a085", // Deep jade teal
                    "#d35400", // Crimson orange
                    "#1e272c"  // Clean obsidian steel
                  ];

                  // Beautiful disjoint-set union vertex clustering to partition distinct connected containers
                  const dsu = new DSU();

                  // First pass: union vertices that are connected in each triangle
                  for (let i = 0; i < count; i += 3) {
                    const k0 = getVertexKey(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
                    const k1 = getVertexKey(posAttr.getX(i + 1), posAttr.getY(i + 1), posAttr.getZ(i + 1));
                    const k2 = getVertexKey(posAttr.getX(i + 2), posAttr.getY(i + 2), posAttr.getZ(i + 2));

                    dsu.union(k0, k1);
                    dsu.union(k0, k2);
                  }

                  // Second pass: accumulate coordinate centroid sums for each distinct connected component
                  const componentCentroids = new Map<string, { sumX: number; sumY: number; sumZ: number; numVerts: number }>();
                  for (let i = 0; i < count; i++) {
                    const x = posAttr.getX(i);
                    const y = posAttr.getY(i);
                    const z = posAttr.getZ(i);

                    const k = getVertexKey(x, y, z);
                    const root = dsu.find(k);

                    let data = componentCentroids.get(root);
                    if (!data) {
                      data = { sumX: 0, sumY: 0, sumZ: 0, numVerts: 0 };
                      componentCentroids.set(root, data);
                    }
                    data.sumX += x;
                    data.sumY += y;
                    data.sumZ += z;
                    data.numVerts += 1;
                  }

                  // Third pass: determine a stable uniform color for each component based on its bounding centroid
                  const componentColors = new Map<string, THREE.Color>();
                  componentCentroids.forEach((data, root) => {
                    const avgX = data.sumX / data.numVerts;
                    const avgY = data.sumY / data.numVerts;
                    const avgZ = data.sumZ / data.numVerts;

                    // Compute stable coordinate-based hash
                    const hashVal = Math.abs(
                      Math.round(avgX * 10) * 73856093 ^
                      Math.round(avgY * 10) * 19349663 ^
                      Math.round(avgZ * 10) * 83492791
                    );
                    const colorHex = containerColors[hashVal % containerColors.length];
                    componentColors.set(root, new THREE.Color(colorHex));
                  });

                  // Fourth pass: paint vertices belonging to each component so there are no split colors inside a single container
                  for (let i = 0; i < count; i++) {
                    const k = getVertexKey(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
                    const root = dsu.find(k);
                    const triColor = componentColors.get(root) || new THREE.Color("#e63946");

                    colors[i * 3] = triColor.r;
                    colors[i * 3 + 1] = triColor.g;
                    colors[i * 3 + 2] = triColor.b;
                  }

                  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
                  mesh.geometry = geometry;

                  const containerMat = new THREE.MeshPhysicalMaterial({
                    vertexColors: true,
                    roughness: 0.5,
                    metalness: 0.25,
                    clearcoat: 0.15,
                    clearcoatRoughness: 0.3,
                    name: "ColoredContainers"
                  });
                  mesh.material = containerMat;
                }
              } else if (isContainership && !isGlass) {
                // Apply a good, premium color to the container ship structure (metallic silver or white)
                const containerShipStructureMat = new THREE.MeshPhysicalMaterial({
                  color: new THREE.Color("#e2e8f0"), // Elegant metallic silver-white
                  roughness: 0.18, // Elegant semi-matte metallic paint sheen
                  metalness: 0.85,  // Solid metallic premium look
                  clearcoat: 0.9,   // Glossy top coat for premium highlights
                  clearcoatRoughness: 0.05,
                  reflectivity: 1.0,
                  name: "ContainerShipStructure"
                });
                mesh.material = containerShipStructureMat;
              } else if (isGlass) {
                const glassMat = new THREE.MeshPhysicalMaterial({
                  color: new THREE.Color(glassColor), // Use active custom glass tint color
                  roughness: 0.01,
                  metalness: 0.1,
                  transparent: true,
                  opacity: 0.5,
                  transmission: 0.95, // Ultimate transparent glass transmission refraction
                  ior: 1.52,
                  thickness: 2.0,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.0,
                  name: "ReflectiveGlass"
                });
                mesh.material = glassMat;
              } else if (matName === "color") {
                // Polished dark onyx / black carbon trim
                const carbonMat = new THREE.MeshPhysicalMaterial({
                  color: new THREE.Color("#0c0a09"), // Solid obsidian piano black
                  roughness: 0.03,
                  metalness: 0.85,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.01,
                  reflectivity: 1.0
                });
                mesh.material = carbonMat;
              } else if (isHull) {
                // High-gloss luxury metallic white yacht skin
                const pearlMat = new THREE.MeshPhysicalMaterial({
                  color: new THREE.Color(hullColor), // Use active custom hull color finish
                  roughness: 0.08, // Mirror-smooth paint finish
                  metalness: 0.65, // Highly glossy metallic sheen
                  clearcoat: 1.0, // High glossy clearcoat
                  clearcoatRoughness: 0.02,
                  reflectivity: 1.0,
                  name: "HullWhite"
                });
                mesh.material = pearlMat;
              } else if (isDeck) {
                // Teak Deck / Timber finish
                const timberMat = new THREE.MeshPhysicalMaterial({
                  color: new THREE.Color(deckColor), // Use active custom deck color finish
                  roughness: 0.35, 
                  metalness: 0.1,
                  clearcoat: 0.1,
                  name: "TeakDeck"
                });
                mesh.material = timberMat;
              } else {
                // General fallback: Convert standard elements to highly glossy physical materials
                const originalColor = originalMat.color ? originalMat.color.clone() : new THREE.Color("#faf9f6");
                if (originalColor.getHex() === 0x7f7f7f || originalColor.getHex() === 0xcccccc || originalColor.getHex() === 0xffffff) {
                   originalColor.set("#faf9f6"); // Smooth eggshell cream-white
                }
                const fallbackMat = new THREE.MeshPhysicalMaterial({
                  color: originalColor,
                  roughness: Math.min(originalMat.roughness || 0.1, 0.06),
                  metalness: originalMat.metalness || 0.1,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.02,
                  reflectivity: 1.0
                });
                mesh.material = fallbackMat;
              }
            }
          }
        });

        const loadedGroup = new THREE.Group();
        loadedGroup.add(innerGroup);
        loadedGroup.position.set(0, 0, 0); // Ground position alignment
        
        loadedShipRef.current = loadedGroup;
        shipGroupRef.current?.add(loadedGroup);
      },
      (xhr) => {
        // Progress (optional)
      },
      (error) => {
        console.error("Failed to load GLB model", error);
        setLoadingModel(false);
        onModelLoadedStatus(false);
      }
    );
  };

  // Helper: load model via browser File Uploader API
  const loadCustomModel = (file: File) => {
    const url = URL.createObjectURL(file);
    loadGLBModel(url, file.name);
  };

  // Helper to update visibility of floating tech pins in 3D Space
  const updateTechnicalIndicators = (sectionId: string) => {
    Object.keys(markersRef.current).forEach((key) => {
      const pin = markersRef.current[key];
      if (!pin) return;

      if (key === sectionId) {
        pin.visible = true;
        // Fade line & pin in
        pin.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.Material;
            if (mat) {
              mat.transparent = true;
              gsap.to(mat, { opacity: 0.85, duration: 0.8 });
            }
          }
        });
      } else {
        // Fade out, then set visibility false
        pin.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.Material;
            if (mat) {
              gsap.to(mat, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                  if (key !== sectionId) pin.visible = false;
                }
              });
            }
          }
        });
      }
    });
  };

  // Helper: Creates beautiful physical 3D technical probes with lines pointing to details
  const createTechnicalMarkers = (scene: THREE.Scene) => {
    // We create structural pins at crucial target coords:
    // 1. Hull Bow - near front waterline
    // 2. Deck pool / Helipad - near mid/aft deck
    // 3. Command bridge - mid height superstructure
    // 4. Propulsion - stern propeller

    const markersData = [
      { id: "hull", target: new THREE.Vector3(-12, -4.0, 0), pos: new THREE.Vector3(-12, -1.0, 4), label: "Bow Wave Slicer" },
      { id: "deck", target: new THREE.Vector3(2, 0.4, 0), pos: new THREE.Vector3(0, 3.5, 4), label: "Main Sun Deck" },
      { id: "superstructure", target: new THREE.Vector3(-3, 3.8, 0), pos: new THREE.Vector3(-3, 6.5, 3), label: "Bridge Suite" },
      { id: "propulsion", target: new THREE.Vector3(14, -4.8, 0), pos: new THREE.Vector3(14, -2.0, 3.5), label: "Azipod Drive System" }
    ];

    markersData.forEach((data) => {
      const markerGroup = new THREE.Group();
      markerGroup.visible = false; // Hidden at start
      markerGroup.position.copy(data.target);

      // Create a floating sphere pointer (Tip)
      const tipGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const tipMat = new THREE.MeshStandardMaterial({
        color: "#f8fafc", // Polished silver metallic tip
        metalness: 0.95,
        roughness: 0.05,
        transparent: true,
        opacity: 0
      });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.name = "tip";
      tip.position.set(0, 1.8, 0);
      markerGroup.add(tip);

      // Create fine circular rings surrounding the tip
      const ringGeo = new THREE.RingGeometry(0.55, 0.62, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: "#cbd5e1",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.name = "ring";
      ring.position.copy(tip.position);
      ring.rotation.x = Math.PI / 2;
      markerGroup.add(ring);

      // Create fine high Tech Probe Line downward to target anchor point
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1.8, 0)
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: "#1c1917", // Charcoal metal
        transparent: true,
        opacity: 0
      });
      const line = new THREE.Line(lineGeo, lineMat);
      markerGroup.add(line);

      // Save reference
      markersRef.current[data.id] = markerGroup;
      scene.add(markerGroup);
    });
  };

  // Helper to dispose entire 3D subtree safely avoiding GPU memory locks
  const disposeHierarchy = (obj: THREE.Object3D) => {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => mat.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      }
    });
  };

  // Generator: Builds a hyper-elegant Custom Procedural Ship with multi-tier yacht specs
  const createProceduralVessel = (): THREE.Group => {
    const vessel = new THREE.Group();

    // 1. HIGH QUALITY PREMIUM MATERIALS CATALOG
    const hullMat = new THREE.MeshPhysicalMaterial({
      color: hullColor, // Dynamic high-gloss luxury metallic white
      roughness: 0.08,  // Highly polished glossy surface
      metalness: 0.65,  // Solid metallic premium sheen
      clearcoat: 1.0,   // Rich clearcoat to reflect surroundings nicely
      clearcoatRoughness: 0.02,
      name: "HullWhite"
    });

    const hullBottomMat = new THREE.MeshPhysicalMaterial({
      color: hullColor === "#f2f4f7" ? "#ebeef3" : hullColor, // Tweak bottom plate color based on hull
      roughness: 0.1,
      metalness: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      name: "HullBottom"
    });

    const deckTeakMat = new THREE.MeshStandardMaterial({
      color: deckColor, // Dynamic bleached beach teakwood hue
      roughness: 0.72,
      metalness: 0.0,
      name: "TeakDeck"
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: glassColor, // Dynamic solid sapphire blue glass
      roughness: 0.05,
      metalness: 0.9,
      transparent: true,
      opacity: 0.88,
      transmission: 0.9,
      ior: 1.5,
      name: "ReflectiveGlass"
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: "#e2e8f0", // Clean luxury chrome
      metalness: 0.96,
      roughness: 0.12,
      name: "ChromeFinishes"
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: "#cbd5e1", // Polished Stainless Steel / Titanium
      metalness: 0.98,
      roughness: 0.08,
      name: "PropellerSteel"
    });

    const stripeMat = new THREE.MeshBasicMaterial({
      color: "#1c1917", // Elegant dark carbon stripe detailing
      name: "CarbonStripe"
    });

    // 2. THE GEOMETRIC BUILDING BLOCKS

    // A. LOWER HULL MAIN BODY
    // Combining a custom tapered front, rectangular cabin center, and rounded stern
    const hullGroup = new THREE.Group();

    // Mid Hull slab
    const midHullGeo = new THREE.BoxGeometry(16, 4.4, 6.4);
    const midHull = new THREE.Mesh(midHullGeo, hullMat);
    midHull.position.set(0, -2.4, 0);
    midHull.castShadow = true;
    midHull.receiveShadow = true;
    hullGroup.add(midHull);

    // Front Pointy Prow Hull (Axe bow look)
    // Tapering bow using cylinder segments or custom translated geometry
    const bowGeo = new THREE.BoxGeometry(12, 4.4, 6.4);
    // Custom manual vertex modification for premium sleek wedge effect
    const vertices = bowGeo.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      // Taper front (+x) vertices to a fine edge
      if (x > 0) {
        vertices.setZ(i, 0); // collapse width at front bow tip
        // Elevate the top-tip point for extreme aerodynamic vertical look
        const y = vertices.getY(i);
        if (y > 0) {
          vertices.setY(i, 2.8); // Curved raised tip
        }
      }
    }
    bowGeo.computeVertexNormals();
    const bow = new THREE.Mesh(bowGeo, hullMat);
    bow.position.set(14, -1.8, 0);
    bow.castShadow = true;
    bow.receiveShadow = true;
    hullGroup.add(bow);

    // Stern transom detailing (Back of ship curving gently inward)
    const sternGeo = new THREE.BoxGeometry(8, 4.4, 6.4);
    const sternVerts = sternGeo.attributes.position;
    for (let i = 0; i < sternVerts.count; i++) {
      const x = sternVerts.getX(i);
      if (x < 0) {
        sternVerts.setZ(i, sternVerts.getZ(i) * 0.7); // Taper stern width
        sternVerts.setY(i, sternVerts.getY(i) * 0.85); // Angle transom steps
      }
    }
    sternGeo.computeVertexNormals();
    const stern = new THREE.Mesh(sternGeo, hullMat);
    stern.position.set(-12, -2.4, 0);
    stern.castShadow = true;
    stern.receiveShadow = true;
    hullGroup.add(stern);

    // Dynamic Carbon Line stripe tracing the complete length of the boat (waterline detail)
    const stripGeo = new THREE.BoxGeometry(34, 0.15, 6.5);
    const waterStripe = new THREE.Mesh(stripGeo, stripeMat);
    waterStripe.position.set(1, -3.2, 0);
    hullGroup.add(waterStripe);

    vessel.add(hullGroup);

    // B. DECK SURFACE FLOOR (Bleached marine teak wood)
    const deckGroup = new THREE.Group();

    // Main central deck
    const deckGeo = new THREE.BoxGeometry(15.9, 0.12, 6.3);
    const mainDeck = new THREE.Mesh(deckGeo, deckTeakMat);
    mainDeck.position.set(0, -0.15, 0);
    mainDeck.receiveShadow = true;
    deckGroup.add(mainDeck);

    // Bow forward teak deck
    const bowDeckGeo = new THREE.BoxGeometry(11.8, 0.12, 6.3);
    const bowDeckVerts = bowDeckGeo.attributes.position;
    for (let i = 0; i < bowDeckVerts.count; i++) {
      if (bowDeckVerts.getX(i) > 0) {
        bowDeckVerts.setZ(i, 0);
      }
    }
    bowDeckGeo.computeVertexNormals();
    const bowDeck = new THREE.Mesh(bowDeckGeo, deckTeakMat);
    bowDeck.position.set(13.9, 0.35, 0);
    bowDeck.receiveShadow = true;
    deckGroup.add(bowDeck);

    // Helipad marking circle on the bow deck
    const helipadRingGeo = new THREE.RingGeometry(1.5, 1.62, 32);
    const helipadRing = new THREE.Mesh(helipadRingGeo, stripeMat);
    helipadRing.rotation.x = -Math.PI / 2;
    helipadRing.position.set(12.5, 0.45, 0);
    deckGroup.add(helipadRing);

    const helipadLabelGeo = new THREE.BoxGeometry(0.12, 0.12, 1.1);
    const helipadLetter1 = new THREE.Mesh(helipadLabelGeo, stripeMat);
    helipadLetter1.position.set(12.5, 0.45, 0);
    const helipadLetter2 = new THREE.Mesh(helipadLabelGeo, stripeMat);
    helipadLetter2.position.set(12.5, 0.45, 0);
    helipadLetter2.rotation.y = Math.PI / 2;
    deckGroup.add(helipadLetter1);
    deckGroup.add(helipadLetter2);

    // Stern beach deck
    const sternDeckGeo = new THREE.BoxGeometry(7.8, 0.12, 6.3);
    const sternDeckVerts = sternDeckGeo.attributes.position;
    for (let i = 0; i < sternDeckVerts.count; i++) {
      if (sternDeckVerts.getX(i) < 0) {
        sternDeckVerts.setZ(i, sternDeckVerts.getZ(i) * 0.7);
      }
    }
    sternDeckGeo.computeVertexNormals();
    const sternDeck = new THREE.Mesh(sternDeckGeo, deckTeakMat);
    sternDeck.position.set(-11.9, -0.15, 0);
    sternDeck.receiveShadow = true;
    deckGroup.add(sternDeck);

    // Interactive Infinity Pool on details aft stern
    const poolGeo = new THREE.BoxGeometry(3.5, 0.28, 2.6);
    const poolWaterMat = new THREE.MeshPhysicalMaterial({
      color: "#efead8", // Glowing rich creme water
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
      transparent: true,
      opacity: 0.75
    });
    const pool = new THREE.Mesh(poolGeo, poolWaterMat);
    pool.position.set(-13, -0.1, 0);
    deckGroup.add(pool);

    // Chrome pool framing border
    const poolBorderGeo = new THREE.BoxGeometry(3.7, 0.35, 2.8);
    const poolBorder = new THREE.Mesh(poolBorderGeo, chromeMat);
    poolBorder.position.set(-13, -0.16, 0);
    deckGroup.add(poolBorder);

    vessel.add(deckGroup);

    // C. THE COMMAND SUPERSTRUCTURE (Cabins / Bridge / Radar Mast)
    const superstructureGroup = new THREE.Group();

    // TIER 1 CABIN (Lower living deck)
    const tier1Geo = new THREE.BoxGeometry(16, 2.5, 5.0);
    // Custom wedge curve windshield front
    const tier1Verts = tier1Geo.attributes.position;
    for (let i = 0; i < tier1Verts.count; i++) {
      const x = tier1Verts.getX(i);
      const y = tier1Verts.getY(i);
      if (x > 0) {
        tier1Verts.setZ(i, tier1Verts.getZ(i) * 0.82); // Sleek tapering forward
        if (y > 0) {
          tier1Verts.setX(i, x - 1.55); // Slanted aerodynamic windshield slope
        }
      }
    }
    tier1Geo.computeVertexNormals();
    const tier1 = new THREE.Mesh(tier1Geo, hullMat);
    tier1.position.set(-1.5, 1.25, 0);
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    superstructureGroup.add(tier1);

    // Windows strips for Tier 1
    const windowStripL = new THREE.Mesh(new THREE.BoxGeometry(10, 0.75, 0.12), glassMat);
    windowStripL.position.set(-1.0, 1.35, 2.51);
    const windowStripR = windowStripL.clone();
    windowStripR.position.z = -2.51;
    superstructureGroup.add(windowStripL);
    superstructureGroup.add(windowStripR);

    // TIER 2 CABIN (Pilot bridge & state room)
    const tier2Geo = new THREE.BoxGeometry(10, 2.2, 4.4);
    const tier2Verts = tier2Geo.attributes.position;
    for (let i = 0; i < tier2Verts.count; i++) {
      const x = tier2Verts.getX(i);
      const y = tier2Verts.getY(i);
      if (x > 0) {
        tier2Verts.setZ(i, tier2Verts.getZ(i) * 0.75);
        if (y > 0) {
          tier2Verts.setX(i, x - 1.8); // Aggressive forward cabin slope
        }
      }
    }
    tier2Geo.computeVertexNormals();
    const tier2 = new THREE.Mesh(tier2Geo, hullMat);
    tier2.position.set(-2.5, 3.5, 0);
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    superstructureGroup.add(tier2);

    // Front wheelhouse commander glass windows
    const bridgeWindowGeo = new THREE.BoxGeometry(1.8, 0.9, 3.4);
    const bridgeWindowVerts = bridgeWindowGeo.attributes.position;
    for (let i = 0; i < bridgeWindowVerts.count; i++) {
      if (bridgeWindowVerts.getY(i) > 0) {
        bridgeWindowVerts.setX(i, bridgeWindowVerts.getX(i) - 0.6);
      }
    }
    bridgeWindowGeo.computeVertexNormals();
    const bridgeWindow = new THREE.Mesh(bridgeWindowGeo, glassMat);
    bridgeWindow.position.set(1.8, 3.65, 0);
    superstructureGroup.add(bridgeWindow);

    // Side windows Tier 2
    const windowStripT2L = new THREE.Mesh(new THREE.BoxGeometry(6, 0.65, 0.12), glassMat);
    windowStripT2L.position.set(-2.0, 3.6, 2.21);
    const windowStripT2R = windowStripT2L.clone();
    windowStripT2R.position.z = -2.21;
    superstructureGroup.add(windowStripT2L);
    superstructureGroup.add(windowStripT2R);

    // EXHAUST CHIMNEYS (Angles carbon-and-chrome funnels)
    const funnelGroup = new THREE.Group();
    const funnelGeo = new THREE.BoxGeometry(1.6, 2.4, 1.2);
    // Angular skew
    const fVerts = funnelGeo.attributes.position;
    for (let i = 0; i < fVerts.count; i++) {
      if (fVerts.getY(i) > 0) {
        fVerts.setX(i, fVerts.getX(i) - 0.7); // rear tilt
      }
    }
    funnelGeo.computeVertexNormals();
    const funnel = new THREE.Mesh(funnelGeo, stripeMat);
    funnel.position.set(-6, 3.8, 0);
    funnel.castShadow = true;
    funnelGroup.add(funnel);

    // Chrome inner pipes
    const exhaustGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.2, 8);
    const exhaust1 = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaust1.position.set(-6.2, 4.8, 0.3);
    exhaust1.rotation.z = -Math.PI / 8;
    const exhaust2 = exhaust1.clone();
    exhaust2.position.z = -0.3;
    funnelGroup.add(exhaust1);
    funnelGroup.add(exhaust2);

    superstructureGroup.add(funnelGroup);

    // D. RADAR ARCH & COMM CENTER (Masts and rotating solid-state telemetry)
    const commGroup = new THREE.Group();

    // Sleek physical Carbon arch spanning crosswise
    const archGeo = new THREE.BoxGeometry(1.2, 3.5, 3.8);
    // Slanted back vertices
    const aVerts = archGeo.attributes.position;
    for (let i = 0; i < aVerts.count; i++) {
      if (aVerts.getY(i) > 0) {
        aVerts.setX(i, aVerts.getX(i) - 0.8);
      }
    }
    archGeo.computeVertexNormals();
    const arch = new THREE.Mesh(archGeo, hullMat);
    arch.position.set(-4.5, 5.8, 0);
    arch.castShadow = true;
    commGroup.add(arch);

    // Dual white satellite radomes sphere (telecommunications)
    const domeGeo = new THREE.SphereGeometry(0.64, 16, 16);
    const domePedGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.5, 8);
    
    // Left dome assembly
    const domeLGroup = new THREE.Group();
    const domeL = new THREE.Mesh(domeGeo, hullMat);
    domeL.position.y = 0.5;
    const domePedL = new THREE.Mesh(domePedGeo, chromeMat);
    domeLGroup.add(domeL);
    domeLGroup.add(domePedL);
    domeLGroup.position.set(-5.0, 7.5, 1.15);
    commGroup.add(domeLGroup);

    // Right dome assembly
    const domeRGroup = domeLGroup.clone();
    domeRGroup.position.z = -1.15;
    commGroup.add(domeRGroup);

    // Rotating Radar wing setup
    const radarBaseGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
    const radarBase = new THREE.Mesh(radarBaseGeo, chromeMat);
    radarBase.position.set(-3.5, 7.5, 0);
    commGroup.add(radarBase);

    // Rotating metal horizontal bar
    const radarBarGeo = new THREE.BoxGeometry(2.8, 0.18, 0.35);
    const radarBar = new THREE.Mesh(radarBarGeo, stripeMat);
    radarBar.position.set(-3.5, 7.8, 0);
    commGroup.add(radarBar);
    radarRef.current = radarBar; // Save ref to spin in loop

    superstructureGroup.add(commGroup);
    vessel.add(superstructureGroup);

    // E. UNDERWATER PORTION: SHIÊLD HULL KEEL, PROPULSION AZIPODS
    const propulsionGroup = new THREE.Group();

    // Central deep keel keelboard
    const keelGeo = new THREE.BoxGeometry(22, 1.2, 0.85);
    const keel = new THREE.Mesh(keelGeo, hullBottomMat);
    keel.position.set(2, -4.8, 0);
    keel.castShadow = true;
    propulsionGroup.add(keel);

    // Twin Azipod Motor Housing (Underwater Gold details)
    const podMountGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.2, 8);
    const podHousingGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 12);
    podHousingGeo.rotateX(Math.PI / 2); // align forward horizontally

    // Port Propeller pod
    const portPodGroup = new THREE.Group();
    const podMountPort = new THREE.Mesh(podMountGeo, chromeMat);
    podMountPort.position.y = 0.5;
    const podHousingPort = new THREE.Mesh(podHousingGeo, chromeMat);
    portPodGroup.add(podMountPort);
    portPodGroup.add(podHousingPort);

    // Three angled golden blades on propeller
    const propBladeGroup = new THREE.Group();
    const propCenterGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const propCenter = new THREE.Mesh(propCenterGeo, brassMat);
    propBladeGroup.add(propCenter);

    const bladeGeo = new THREE.BoxGeometry(0.12, 0.9, 0.35);
    // skew blade vertices slightly for dynamic push look
    const bVerts = bladeGeo.attributes.position;
    for (let i = 0; i < bVerts.count; i++) {
      if (bVerts.getY(i) > 0) {
        bVerts.setZ(i, bVerts.getZ(i) + 0.15);
      }
    }
    bladeGeo.computeVertexNormals();

    for (let j = 0; j < 4; j++) {
      const blade = new THREE.Mesh(bladeGeo, brassMat);
      blade.rotation.x = (Math.PI / 2) * j;
      blade.position.y = Math.sin((Math.PI / 2) * j) * 0.45;
      blade.position.z = Math.cos((Math.PI / 2) * j) * 0.45;
      propBladeGroup.add(blade);
    }
    propBladeGroup.position.set(0.9, 0, 0); // Position at the very front/back of the pod housing
    portPodGroup.add(propBladeGroup);
    portPodGroup.position.set(13, -5.2, 1.55);
    propulsionGroup.add(portPodGroup);
    propellersRef.current.push(propBladeGroup);

    // Starboard Propeller pod assembly
    const stbdPodGroup = portPodGroup.clone();
    stbdPodGroup.position.z = -1.55;
    propulsionGroup.add(stbdPodGroup);
    // Find nested propeller group inside the cloned instance and save reference to animate it
    const stbdProp = stbdPodGroup.children[2] as THREE.Mesh;
    if (stbdProp) {
      propellersRef.current.push(stbdProp);
    }

    // Double stability fins midship
    const stabGeo = new THREE.BoxGeometry(0.8, 0.12, 2.2);
    // wing slant
    const stabPort = new THREE.Mesh(stabGeo, chromeMat);
    stabPort.position.set(2, -4.5, 3.2);
    stabPort.rotation.x = Math.PI / 6; // Angled down slightly
    propulsionGroup.add(stabPort);

    const stabStbd = stabPort.clone();
    stabStbd.position.z = -3.2;
    stabStbd.rotation.x = -Math.PI / 6;
    propulsionGroup.add(stabStbd);

    vessel.add(propulsionGroup);

    // Center entire composition nicely (offsetting the bow-heavy geometry so that visual center spans (0, 0, 0))
    vessel.position.set(0.5, 0, 0);

    return vessel;
  };

  // Utility to guarantee custom settings or deep clone on procedural materials nested inside models
  const blockMaterial = (model: THREE.Mesh): THREE.Material => {
    return model.material as THREE.Material;
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#0d0e12] z-0 overflow-hidden">
      <canvas
        id="vessel-canvas"
        ref={canvasRef}
        style={{ opacity: 0 }}
        className="w-full h-full block touch-none"
      />
      
      {loadingModel && (
        <div id="vessel-loader" className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-30 transition-all duration-300">
          <div className="w-12 h-12 rounded-full border-4 border-stone-200 border-t-stone-800 animate-spin mb-4" />
          <p className="font-mono text-xs tracking-widest text-stone-600 uppercase">Indexing GLB Geometry...</p>
        </div>
      )}
    </div>
  );
}
