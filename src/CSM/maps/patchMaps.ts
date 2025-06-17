import { iCSMPatchMap } from "../types";
import { keywordMap } from "./keywordMap";

// Map of CSM keywords to their substitutions
export const defaultPatchMap: iCSMPatchMap = {
  // VERT

  [`${keywordMap.normal}`]: {
    "#include <beginnormal_vertex>": `
    vec3 objectNormal = ${keywordMap.normal};
    #ifdef USE_TANGENT
	    vec3 objectTangent = vec3( tangent.xyz );
    #endif
    `,
  },
  [`${keywordMap.position}`]: {
    "#include <begin_vertex>": `
    vec3 transformed = ${keywordMap.position};
  `,
  },
  [`${keywordMap.positionRaw}`]: {
    "#include <begin_vertex>": `
    vec4 csm_internal_positionUnprojected = ${keywordMap.positionRaw};
    mat4x4 csm_internal_unprojectMatrix = projectionMatrix * modelViewMatrix;
    #ifdef USE_INSTANCING
      csm_internal_unprojectMatrix = csm_internal_unprojectMatrix * instanceMatrix;
    #endif
    csm_internal_positionUnprojected = inverse(csm_internal_unprojectMatrix) * csm_internal_positionUnprojected;
    vec3 transformed = csm_internal_positionUnprojected.xyz;
  `,
  },
  [`${keywordMap.pointSize}`]: {
    "gl_PointSize = size;": `
    gl_PointSize = ${keywordMap.pointSize};
    `,
  },

  // FRAG

  [`${keywordMap.diffuse}`]: {
    "#include <color_fragment>": `
    #include <color_fragment>
    diffuseColor = ${keywordMap.diffuse};
  `,
  },
  [`${keywordMap.fragColor}`]: {
    "#include <dithering_fragment>": `
    #include <dithering_fragment>
    gl_FragColor  = ${keywordMap.fragColor};
  `,
  },
  [`${keywordMap.emissive}`]: {
    "vec3 totalEmissiveRadiance = emissive;": `
    vec3 totalEmissiveRadiance = ${keywordMap.emissive};
    `,
  },
  [`${keywordMap.roughness}`]: {
    "#include <roughnessmap_fragment>": `
    #include <roughnessmap_fragment>
    roughnessFactor = ${keywordMap.roughness};
    `,
  },
  [`${keywordMap.metalness}`]: {
    "#include <metalnessmap_fragment>": `
    #include <metalnessmap_fragment>
    metalnessFactor = ${keywordMap.metalness};
    `,
  },
  [`${keywordMap.ao}`]: {
    "#include <aomap_fragment>": `
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= 1. - ${keywordMap.ao};
    `,
  },
  [`${keywordMap.bump}`]: {
    "#include <normal_fragment_maps>": `
    #include <normal_fragment_maps>

    vec3 csm_internal_orthogonal = ${keywordMap.bump} - (dot(${keywordMap.bump}, normal) * normal);
    vec3 csm_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_internal_orthogonal;
    normal = normalize(normal - csm_internal_projectedbump);
    `,
  },
  [`${keywordMap.depthAlpha}`]: {
    "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );": `
      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * ${keywordMap.depthAlpha} );
    `,
    "gl_FragColor = packDepthToRGBA( fragCoordZ );": `
      gl_FragColor = packDepthToRGBA( fragCoordZ );
      gl_FragColor.a *= ${keywordMap.depthAlpha};
    `,
  },
  [`${keywordMap.clearcoat}`]: {
    "material.clearcoat = clearcoat;": `material.clearcoat = ${keywordMap.clearcoat};`,
  },
  [`${keywordMap.clearcoatRoughness}`]: {
    "material.clearcoatRoughness = clearcoatRoughness;": `material.clearcoatRoughness = ${keywordMap.clearcoatRoughness};`,
  },
  [`${keywordMap.clearcoatNormal}`]: {
    "#include <clearcoat_normal_fragment_begin>": `
      vec3 csm_coat_internal_orthogonal = csm_ClearcoatNormal - (dot(csm_ClearcoatNormal, nonPerturbedNormal) * nonPerturbedNormal);
      vec3 csm_coat_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_coat_internal_orthogonal;
      vec3 clearcoatNormal = normalize(nonPerturbedNormal - csm_coat_internal_projectedbump);
    `,
  },
};

export const shaderMaterial_PatchMap: iCSMPatchMap = {
  // VERT
  [`${keywordMap.position}`]: {
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );": `
    gl_Position = projectionMatrix * modelViewMatrix * vec4( ${keywordMap.position}, 1.0 );
  `,
  },
  [`${keywordMap.positionRaw}`]: {
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );": `
    gl_Position = ${keywordMap.position};
  `,
  },

  // FRAG
  [`${keywordMap.diffuse}`]: {
    "gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );": `
    gl_FragColor = ${keywordMap.diffuse};
  `,
  },
  [`${keywordMap.fragColor}`]: {
    "gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );": `
    gl_FragColor = ${keywordMap.fragColor};
  `,
  },
};
