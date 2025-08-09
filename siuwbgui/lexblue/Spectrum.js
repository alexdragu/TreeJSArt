import {
	BufferGeometry,
	Float32BufferAttribute,
	LineSegments,
	LineBasicMaterial,
	Matrix3,
	Vector3
} from 'three';

import * as THREE from 'three';

class HeightMesh {

    uniforms;

    constructor() {
        this.mesh = null;
        this.geometry = null;
        this.material = null;
        this.heights = null;
        this.xstep = 1;
        this.ystep = 1;
        this.h_factor = 1;

        this.nx = 400;
        this.ny = 32;

        // axes defaults
        this.step_factor = 1.1;// axes slightly larger than mesh step
        this.nx_axes = 5;
        this.ny_axes = 9;
        this.geometry_axes = null;
        this.material_axes = null;
        this.zoffset = -1.0;
        this.geometry_axes = null;
        this.material_axes = null;
        this.mesh_axes = null;


        this.time = 0;
        this.shaderMaterialCanvas = null;
        this.shaderMaterialCanvasAxes = null;
        
        this.redpalette = [];
        this.greenpalette = [];
        this.bluepalette = [];

        this.renderGroup = new THREE.Group();
        this.generatePalette();

        
        this.uniforms = {
            pointTexture: { value: new THREE.TextureLoader().load( 'textures/grid.png' ) }  // disc    //ball
        };
    }

    /**
     * Initialize the mesh
     * @param {Array} heights - 2D array [nx][ny] of heights
     * @param {number} xstep - distance between vertices in X
     * @param {number} ystep - distance between vertices in Y
     * @param {number} h_factor - height multiplier
     * @param {THREE.ShaderMaterial} surfaceMaterial - shader material to use (from LbMap)
     */
    init(heights, xstep, ystep, h_factor, nx, ny) {
        this.heights = heights;
        this.xstep = xstep;
        this.ystep = ystep;
        this.h_factor = h_factor;
        this.nx = nx ;
        this.ny = ny ;

        const vertices = [];
        const uvs = [];
        const colors = [];


        // Generate vertices, uvs, and colors
        for (let i = 0; i < nx; i++) {
            for (let j = 0; j < ny; j++) {
                const x = i * xstep - ((nx-1) * xstep) / 2; // Center the mesh
                const y = j * ystep - ((ny-1) * ystep) / 2; // Center the mesh
                const h = heights[i][j];
                const z = 0;

                //vertices.push(x, y, z);
                //uvs.push(i / (nx - 1), j / (ny - 1));

                vertices.push(y, x, z);
                uvs.push(j / (ny - 1),i / (nx - 1));

                // Example: color based on height (normalized between 0 and 1)
                const colorVal = (h - 0) / (10 - 0); // assuming min=0, max=10
                colors.push(colorVal, 0.5, 1 - colorVal); // RGB
            }
        }

        // Generate indices for surface mesh (two triangles per quad)
        const indices = [];
        for (let i = 0; i < nx - 1; i++) {
            for (let j = 0; j < ny - 1; j++) {
                const a = i * ny + j;
                const b = (i + 1) * ny + j;
                const c = (i + 1) * ny + (j + 1);
                const d = i * ny + (j + 1);
                // First triangle
                indices.push(a, b, d);
                // Second triangle
                indices.push(b, c, d);
            }
        }


        this.shaderMaterialCanvas = new THREE.ShaderMaterial( {

            uniforms: this.uniforms,
            vertexShader: document.getElementById( 'vertexshader_canvas' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader_canvas' ).textContent,

            blending: THREE.NormalBlending,
            depthTest: true,
            transparent: false,
            side: THREE.DoubleSide, 
            vertexColors: true,
            flatShading: false,
            wireframe: false
        } );

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); // <-- Added color attribute
        this.geometry.setIndex(indices);
        this.geometry.computeVertexNormals();

        //this.material = surfaceMaterial;
        this.material = this.shaderMaterialCanvas;

        //this.material.transparent = false;
        //this.material.opacity = 1.0;

        this.geometry.computeVertexNormals();

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.renderGroup.add(this.mesh);
    }

    init_axes(zoffset) {        
        let xstep = (this.xstep*this.nx-1)/(this.nx_axes-1)* this.step_factor;
        let ystep = (this.ystep*this.ny-1)/(this.ny_axes-1)* this.step_factor;

        this.ystep = ystep;
        this.zoffset = zoffset;

        const vertices = [];
        const uvs = [];
        const colors = [];
        const nx = this.nx_axes;
        const ny = this.ny_axes;

        console.log("Building the axes mesh with nx:", nx, "ny:", ny, "xstep:", xstep, "ystep:", ystep, "zoffset:", zoffset);
        // Generate vertices, uvs, and colors
        for (let i = 0; i < nx; i++) {
            for (let j = 0; j < ny; j++) {
                const x = (i * xstep - ((nx-1) * xstep) / 2); // Center the mesh
                const y = (j * ystep - ((ny-1) * ystep) / 2); // Center the mesh
                const z = this.zoffset;

                vertices.push(y, x, z);
                uvs.push(j / (ny - 1),i / (nx - 1));

                colors.push(0.8, 0.8, 0.6); // RGB
            }
        }

        // Generate indices for surface mesh (two triangles per quad)
        const indices = [];
        for (let i = 0; i < nx - 1; i++) {
            for (let j = 0; j < ny - 1; j++) {
                const a = i * ny + j;
                const b = (i + 1) * ny + j;
                const c = (i + 1) * ny + (j + 1);
                const d = i * ny + (j + 1);
                // First triangle
                indices.push(a, b, d);
                // Second triangle
                indices.push(b, c, d);
            }
        }



        this.shaderMaterialCanvasAxes = new THREE.ShaderMaterial( {

            uniforms: this.uniforms,
            vertexShader: document.getElementById( 'vertexshader_canvas' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader_canvas_axis' ).textContent,

            blending: THREE.NormalBlending,
            depthTest: true,
            transparent: true,
            side: THREE.DoubleSide, 
            vertexColors: true,
            flatShading: true,
            wireframe: false
        } );

        this.geometry_axes = new THREE.BufferGeometry();
        this.geometry_axes.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.geometry_axes.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        this.geometry_axes.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); // <-- Added color attribute
        this.geometry_axes.setIndex(indices);
        this.geometry_axes.computeVertexNormals();

        //this.material = surfaceMaterial;
        this.material_axes = this.shaderMaterialCanvasAxes;

        //this.material.transparent = false;
        //this.material.opacity = 1.0;


        this.mesh_axes = new THREE.Mesh(this.geometry_axes, this.material_axes);
        this.renderGroup.add(this.mesh_axes);
    }



    /**
     * Update the mesh heights based on time
     * @param {number} time - current time
     */
    update(time) {
        this.time = time;
        const pos = this.geometry.getAttribute('position');
        
        let idx = 0;
        for (let i = 0; i < this.nx; i++) {
            for (let j = 0; j < this.ny; j++) {
                const h = this.heights[i][j];
                const z = h * Math.sin(time + pos.getZ(idx)) * this.h_factor* (idx%2);
                pos.setZ(idx, z);
                idx++;
            }
        }
        pos.needsUpdate = true;
        this.geometry.computeVertexNormals();
    }

    /**
     * Pull UWB data
     * @param {string} objId
     */
    updateUWB(data) {
        const pos = this.geometry.getAttribute('position');
        const col = this.geometry.getAttribute('color');

        let idx = 0;
        if (typeof data === 'string') {
            try {
                const arr = JSON.parse(data);
                //console.log("Data is string, parsed to array:", arr);
                if (Array.isArray(arr)) {                    
                    this.heights = arr;
                }
            } catch (e) {
                console.error('Invalid UWB data:', e);
                return;
            }
        } else if (Array.isArray(data)) {
            console.log("Data is array:", data);
            this.heights = data;
        }
        //console.log("DOUBLECHECK :", data);
        //console.log('Updating heights with UWB data:', this.heights);     
        
        for (let i = 0; i < this.nx; i++) {
            for (let j = 0; j < this.ny; j++) {
                const h = this.heights[i][j]*this.h_factor;
                const h1 = this.heights[i][j];
                
                pos.setZ(idx, h);
                const colorVal = (h - 0) / (10 - 0); // assuming min=0, max=10
                col.setXYZ( idx,  colorVal, 0.5, 1 - colorVal  );
                //colors.push(colorVal, 0.5, 1 - colorVal); // RGB

                //col.setXYZ( idx,  this.redpalette[h1], this.greenpalette[h1], this.bluepalette[h1] );

                idx++;
            }
        }
        pos.needsUpdate = true;
        col.needsUpdate = true;
//        this.geometry.computeVertexNormals();
    }

    updateUWBArray(arri) {
        
        const pos = this.geometry.getAttribute('position');
        const col = this.geometry.getAttribute('color');

        let idx = 0;


        for (let i = 0; i < this.nx; i++) {
            for (let j = 0; j < this.ny; j++) {
/*
                const h = arri[i*this.ny+j]*this.h_factor;
                pos.setZ(idx, h);

                const colorVal = (h - 0) / (10 - 0); // assuming min=0, max=10                
                //col.setXYZ( idx,  colorVal, 0.5, 1 - colorVal  );

                col.setXYZ( idx,  this.redpalette[arri[i*this.ny+j]], this.greenpalette[arri[i*this.ny+j]], this.bluepalette[arri[i*this.ny+j]] );
*/
                pos.setZ(idx, arri[idx]*this.h_factor);
                col.setXYZ( idx,  this.redpalette[arri[idx]], this.greenpalette[arri[idx]], this.bluepalette[arri[idx]] );                


                //const colorVal = (h - 0) / (10 - 0); // assuming min=0, max=10                
                //col.setXYZ( idx,  colorVal, 0.5, 1 - colorVal  );
                
                idx++;
            }
        }

        pos.needsUpdate = true;
        col.needsUpdate = true;
       // this.geometry.computeVertexNormals();

    }

      updateAudioArray(arri) {
        
        const pos = this.geometry.getAttribute('position');
        const col = this.geometry.getAttribute('color');

        let idx = 0;


        for (let i = 0; i < this.nx; i++) {
            for (let j = 0; j < this.ny; j++) {
/*
                const h = arri[i*this.ny+j]*this.h_factor;
                pos.setZ(idx, h);

                const colorVal = (h - 0) / (10 - 0); // assuming min=0, max=10                
                //col.setXYZ( idx,  colorVal, 0.5, 1 - colorVal  );

                col.setXYZ( idx,  this.redpalette[arri[i*this.ny+j]], this.greenpalette[arri[i*this.ny+j]], this.bluepalette[arri[i*this.ny+j]] );
*/
                pos.setZ(idx, arri[idx]*this.h_factor);
                //col.setXYZ( idx,  this.redpalette[arri[idx]], this.greenpalette[arri[idx]], this.bluepalette[arri[idx]] );                

                const h = arri[i*this.ny+j]*this.h_factor;
                const colorVal = (h - 0) / (10 - 0); // assuming min=0, max=10                
                col.setXYZ( idx,  colorVal, 0.5, 1 - colorVal  );
                
                idx++;
            }
        }

        pos.needsUpdate = true;
        col.needsUpdate = true;
       // this.geometry.computeVertexNormals();

    }




    /**
     * Add the mesh to the scene
     * @param {THREE.Scene} scene
     */
    render(scene) {
        /*
        if (this.mesh && !scene.children.includes(this.mesh)) {
            console.log("Adding the MAIN mesh to the scene");
            scene.add(this.mesh);
        }

        if (this.mesh_axes && !scene.children.includes(this.mesh_axes)) {
            console.log("Adding the AXES mesh to the scene");
            scene.add(this.mesh_axes);
        }
        */

        if (this.renderGroup && !scene.children.includes(this.renderGroup)) {
            console.log("Adding the renderGroup to the scene");
            scene.add(this.renderGroup);
        }
    }

    generatePalette() {
        const minval = 0;
        const maxval = 4096;


        const populate = (mincol ,maxcol , istart, iend) => {


            for (let i = minval; i < maxval; i++) {
                const j = i/maxval;
                if (j>= istart && j < iend) {
                    this.redpalette[i] = mincol[0] + (j - istart) * (maxcol[0] - mincol[0]) ;
                    this.greenpalette[i] = mincol[1] + (j - istart) * (maxcol[1] - mincol[1]);
                    this.bluepalette[i] = mincol[2] + (j - istart) * (maxcol[2] - mincol[2]) ;
                } 

                //console.log("Color at index", i, ":", this.redpalette[i], this.greenpalette[i], this.bluepalette[i] );
                //console.log("Red Palette:", this.redpalette);
            }

        }

//        populate ([0, 0, 0.1], [0, 0, 1.0], 0, 1.0); // Dark Blue to Blue

        populate ([0, 0.15, 0.2], [0, 0.4, 1.0], 0, 0.06); // Dark Blue to Blue
        populate ([0, 0.4, 1.0], [0, 1.0, 1.0], 0.06, 0.20); // Blue to Cyan
        populate ([0, 1.0, 1.0], [0, 1.0, 0], 0.20, 0.40); // Cyan to Green
        populate ([0, 1.0, 0], [1.0, 1.0, 0], 0.40, 0.50); // Green to Yellow
        populate ([1.0, 1.0, 0], [1.0, 0, 0], 0.50, 0.8); // Yellow to Red
        populate ([1.0, 0.0, 0], [0.5, 0, 0], 0.8, 1.0); // Red to DarkRed

        //console.log("Red Palette:", this.redpalette);
        //console.log("Green Palette:", this.greenpalette);  
        //console.log("Blue Palette:", this.bluepalette);
    }

    

}

// Helper function to generate a random 400x32 array of heights
export function generateRandomHeights(nx = 400, ny = 32, min = 0, max = 10) {
    const arr = [];
    for (let i = 0; i < nx; i++) {
        arr[i] = [];
        for (let j = 0; j < ny; j++) {
            arr[i][j] = min + Math.random() * (max - min);
        }
    }
    return arr;
}

export { HeightMesh };