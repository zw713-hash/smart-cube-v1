import React from 'react';
import { RoundedBox, Cylinder, Text, useGLTF } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { useStore } from '../store';
import * as THREE from 'three';

// =============================================================
// ⚠️ DEVELOPER SETTINGS: CUSTOM MODEL LOADING
// =============================================================
// To use your own CAD model:
// 1. Convert your file to 'case.glb'
// 2. Place 'case.glb' in the 'public/' folder of the project
// 3. Set USE_CUSTOM_GLB = true below
// 4. Update the mesh names (TOP_MESH_NAME, etc) to match your GLB file structure
const USE_CUSTOM_GLB = false; 

const CUSTOM_MESH_NAMES = {
  TOP_SHELL: 'Shell_Top',    // Replace with your exact mesh name from Blender/Onshape
  BOTTOM_SHELL: 'Shell_Bottom', 
  LED_STRIP: 'LED_Ring',
  PCB: 'PCB_Main'
};
// =============================================================

// Helper for parts with animations
const Part = ({ 
  id, 
  position, 
  children, 
  onClick, 
  transparent = false, 
  color: baseColor,
  materialPreset = 'matte',
  ...props 
}: any) => {
  const { setHighlightedPart, highlightedPart, isGhostMode } = useStore();
  
  const isHovered = highlightedPart === id;

  // Enhanced spring animation for hover scale
  const { scale } = useSpring({
    scale: isHovered ? 1.15 : 1,
    config: { mass: 1, tension: 280, friction: 18 }
  });

  // Material Logic
  const actualTransparent = isGhostMode ? true : transparent;
  const displayColor = isHovered ? '#06b6d4' : (baseColor || '#333');

  // Determine opacity and material properties based on preset
  let opacity = 1;
  let metalness = 0.2;
  let roughness = 0.5;
  let transmission = 0;
  let thickness = 0;
  
  if (isGhostMode) {
      opacity = isHovered ? 0.8 : 0.15;
  } else if (materialPreset === 'transparent') {
      opacity = 0.3;
      transmission = 0.9;
      roughness = 0.1;
      thickness = 1.0;
  } else if (materialPreset === 'metal') {
      metalness = 0.9;
      roughness = 0.2;
  } else if (transparent) {
      opacity = 0.5;
  }

  return (
    <animated.group 
      position={position} 
      scale={scale}
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        setHighlightedPart(id);
        if(onClick) onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHighlightedPart(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHighlightedPart(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === 'group') return child;

          const childProps = child.props as any;
          const childChildren = React.Children.toArray(childProps.children);
          
          let hasMaterial = false;

          const newChildren = childChildren.map((c: any) => {
            if (React.isValidElement(c) && typeof c.type === 'string' && 
               (c.type.includes('Material'))) {
               hasMaterial = true;
               return React.cloneElement(c, {
                   transparent: actualTransparent || materialPreset === 'transparent',
                   opacity: opacity,
                   color: displayColor,
                   roughness: (c.props as any).roughness ?? roughness,
                   metalness: (c.props as any).metalness ?? metalness,
                   transmission: (c.props as any).transmission ?? transmission,
                   thickness: (c.props as any).thickness ?? thickness,
                   wireframe: isGhostMode && !isHovered,
                   attach: 'material'
               } as any);
            }
            return c;
          });

          if (!hasMaterial) {
              // Inject default material if none found
              const MatType = materialPreset === 'transparent' ? 'meshPhysicalMaterial' : 'meshStandardMaterial';
              newChildren.push(
                 // @ts-ignore
                 React.createElement(MatType, {
                    key: "injected-mat",
                    attach: "material",
                    transparent: actualTransparent || materialPreset === 'transparent',
                    opacity: opacity,
                    color: displayColor,
                    roughness: roughness,
                    metalness: metalness,
                    transmission: transmission,
                    thickness: thickness,
                    wireframe: isGhostMode && !isHovered,
                 })
              );
          }

          return React.cloneElement(child, {
             children: newChildren,
             material: undefined 
          } as any);
        }
        return child;
      })}
    </animated.group>
  );
};

export const Scene: React.FC = () => {
  const { isExploded, caseColor, caseMaterial, currentMode, customModeName, modes } = useStore();
  
  // Retrieve settings for the current active mode safely
  const activeSettings = modes?.[currentMode] || {
    noiseThreshold: 0,
    brightness: 50,
    ledColor: '#ffffff'
  };

  const { topY, bottomY } = useSpring({
    topY: isExploded ? 2.2 : 0.65,
    bottomY: isExploded ? -2.2 : -0.65,
    config: { mass: 1, tension: 60, friction: 14 }
  });

  const ledColor = new THREE.Color(activeSettings.ledColor || '#ffffff');
  const emissionIntensity = ((activeSettings.brightness || 0) / 100) * 4; 
  const modeLabel = currentMode === 'custom' ? customModeName : currentMode;

  // CUSTOM GLB LOADING LOGIC
  let customNodes: any = null;
  if (USE_CUSTOM_GLB) {
     // This hook will attempt to load /case.glb. 
     // If file is missing, it might throw, so only enable flag if file exists.
     // eslint-disable-next-line react-hooks/rules-of-hooks
     const { nodes } = useGLTF('/case.glb') as any;
     customNodes = nodes;
     // Helpful log to find your mesh names
     console.log("Loaded GLB Nodes:", nodes); 
  }

  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      
      {/* TOP LAYER */}
      <animated.group position-y={topY}>
        <Part 
            id="shell_top" 
            color={caseColor} 
            materialPreset={caseMaterial}
        >
            {USE_CUSTOM_GLB && customNodes && customNodes[CUSTOM_MESH_NAMES.TOP_SHELL] ? (
               <primitive object={customNodes[CUSTOM_MESH_NAMES.TOP_SHELL].geometry} />
            ) : (
              <RoundedBox args={[2, 0.4, 2]} radius={0.1} smoothness={4} />
            )}
        </Part>

        <Part id="led_strip" position={[0, -0.15, 0]}>
          <mesh>
             <torusGeometry args={[0.6, 0.05, 16, 32]} />
             <meshStandardMaterial 
                color={ledColor} 
                emissive={ledColor} 
                emissiveIntensity={emissionIntensity} 
                toneMapped={false}
             />
          </mesh>
        </Part>

        <Part id="pcb_main_screen" position={[0, 0.21, 0]} rotation={[-Math.PI/2, 0, 0]}>
           <mesh>
             <planeGeometry args={[0.8, 0.5]} />
             <meshBasicMaterial color="black" />
           </mesh>
           <group>
             <Text position={[0, 0, 0.01]} fontSize={0.1} color="white" anchorX="center" anchorY="middle">
               {modeLabel ? modeLabel.toUpperCase() : '...'}
             </Text>
             <Text position={[0, -0.15, 0.01]} fontSize={0.05} color="#888" anchorX="center" anchorY="middle">
               {activeSettings.noiseThreshold ?? 0}dB
             </Text>
           </group>
        </Part>
      </animated.group>

      {/* MIDDLE LAYER */}
      <group position={[0, 0, 0]}>
        <Part id="pcb_main" color="#106636">
          <RoundedBox args={[1.8, 0.2, 1.8]} radius={0.05} smoothness={4}>
            <meshStandardMaterial color="#106636" roughness={0.5} metalness={0.6} />
          </RoundedBox>
        </Part>

        <Part id="pcb_main_esp32" position={[0, 0.15, 0]} color="#222">
          <RoundedBox args={[0.6, 0.1, 0.6]} radius={0.02}>
            <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} />
          </RoundedBox>
          <group>
             <Text position={[0, 0.06, 0]} fontSize={0.08} rotation={[-Math.PI/2,0,0]} color="#aaa" anchorX="center" anchorY="middle">
               ESP32
             </Text>
          </group>
        </Part>

        <Part id="sensors" position={[0.8, 0.15, 0.8]} color="#d4af37">
           <Cylinder args={[0.1, 0.1, 0.1, 16]}>
             <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.3} />
           </Cylinder>
        </Part>
        <Part id="sensors" position={[-0.8, 0.15, -0.8]} color="#d4af37">
           <Cylinder args={[0.1, 0.1, 0.1, 16]}>
             <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.3} />
           </Cylinder>
        </Part>
      </group>

      {/* BOTTOM LAYER */}
      <animated.group position-y={bottomY}>
        <Part id="battery_pack" position={[0, 0.3, 0]} color="#0055cc">
           <RoundedBox args={[1.2, 0.4, 0.8]} radius={0.1}>
             <meshStandardMaterial color="#0055cc" roughness={0.3} />
           </RoundedBox>
        </Part>

        <Part id="speaker_unit" position={[0, -0.1, 0]} color="#111">
           <Cylinder args={[0.6, 0.4, 0.4, 32]}>
             <meshStandardMaterial color="#111" />
           </Cylinder>
        </Part>

        <Part 
            id="shell_bottom" 
            color={caseColor}
            materialPreset={caseMaterial}
        >
             {USE_CUSTOM_GLB && customNodes && customNodes[CUSTOM_MESH_NAMES.BOTTOM_SHELL] ? (
               <primitive object={customNodes[CUSTOM_MESH_NAMES.BOTTOM_SHELL].geometry} />
            ) : (
               <RoundedBox args={[2, 0.8, 2]} radius={0.1} smoothness={4} />
            )}
        </Part>
      </animated.group>
    </group>
  );
};