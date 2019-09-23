/**
 *  world space
 * 
 */


function epsilon( value: number ): number {
    return Math.abs( value ) < 0.000001 ? 0 : value;
}

// convert degrees to radians
var degreeToRadiansFactor = Math.PI / 180;
function degToRad( degrees: number): number {
    return degrees * degreeToRadiansFactor;
}

// convert radians to degress
var radianToDegreesFactor = 180 / Math.PI;
function radToDeg( radians: number): number {
    return radians * radianToDegreesFactor;
}    	

// minimal vector class
export class Vector {
    constructor(public x: number,
                public y: number,
                public z: number) {
    }
    static times(k: number, v: Vector) { return new Vector(k * v.x, k * v.y, k * v.z); }
    static minus(v1: Vector, v2: Vector) { return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z); }
    static plus(v1: Vector, v2: Vector) { return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z); }
    static dot(v1: Vector, v2: Vector) { return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z; }
    static mag(v: Vector) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }
    static norm(v: Vector) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    }
    static cross(v1: Vector, v2: Vector) {
        return new Vector(v1.y * v2.z - v1.z * v2.y,
                          v1.z * v2.x - v1.x * v2.z,
                          v1.x * v2.y - v1.y * v2.x);
    }
    toString(): string {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    }
}

export class Matrix {
    // the matrix elements
    elements: number[];
    constructor ( n11: number, n12: number, n13: number, n14: number, 
                  n21: number, n22: number, n23: number, n24: number, 
                  n31: number, n32: number, n33: number, n34: number, 
                  n41: number, n42: number, n43: number, n44: number ) {
    	this.elements = new Array<number>( 16 );
        var te = this.elements;
		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;
		return this;
    }
    
    // transpose the matrix, returning a new matrix with the result
    static transpose(m: Matrix): Matrix {
        var e=m.elements;
        
        return new Matrix(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8],e[9],e[10],e[11],e[12],e[13],e[14],e[15]);
        
    }     

	static identity(): Matrix { 
        return new Matrix(1, 0, 0, 0, 
                          0, 1, 0, 0, 
                          0, 0, 1, 0, 
                          0, 0, 0, 1); 
    }
    static makeRotationFromEuler (eu: Vector): Matrix {   
        var x=degToRad(eu.x);
        var y=degToRad(eu.y);
        var z=degToRad(eu.z);
        var zr = new Matrix(Math.cos(z), -Math.sin(z), 0, 0, 
                            Math.sin(z), Math.cos(z), 0, 0, 
                            0, 0, 1, 0, 
                            0, 0, 0, 1);  
        var yr=new Matrix(Math.cos(y), 0, Math.sin(y), 0, 
                         0, 1, 0, 0, 
                         -Math.sin(y), 0, Math.cos(y), 0, 
                         0, 0, 0, 1);   

        var xr=new Matrix(1, 0, 0, 0, 
                          0, Math.cos(x), -Math.sin(x), 0, 
                          0, Math.sin(x), Math.cos(x), 0, 
                          0, 0, 0, 1);

        var r=xr.multiply(yr).multiply(zr);
        return r;
	}

    static makeTranslation(t: Vector): Matrix {

        var tr=new Matrix(1, 0, 0, t.x, 
                          0, 1, 0, t.y, 
                          0, 0, 1, t.z, 
                          0, 0, 0, 1); 
        return tr;
        
    }
   
	static makeScale(s: Vector): Matrix {
        return new Matrix(s.x, 0, 0, 0, 
                          0, s.y, 0, 0, 
                          0, 0, s.z, 0, 
                          0, 0, 0, 1); 
    }
        
    multiply (b: Matrix ): Matrix {
        var be = b.elements;
        var te=this.elements;
        var n11=te[0]*be[0]+te[4]*be[1]+te[8]*be[2]+te[12]*be[3];
        var n21=te[1]*be[0]+te[5]*be[1]+te[9]*be[2]+te[13]*be[3];
        var n31=te[2]*be[0]+te[6]*be[1]+te[10]*be[2]+te[14]*be[3];
        var n41=te[3]*be[0]+te[7]*be[1]+te[11]*be[2]+te[15]*be[3];

        var n12=te[0]*be[4]+te[4]*be[5]+te[8]*be[6]+te[12]*be[7];
        var n22=te[1]*be[4]+te[5]*be[5]+te[9]*be[6]+te[13]*be[7];
        var n32=te[2]*be[4]+te[6]*be[5]+te[10]*be[6]+te[14]*be[7];
        var n42=te[3]*be[4]+te[7]*be[5]+te[11]*be[6]+te[15]*be[7];

        var n13=te[0]*be[8]+te[4]*be[9]+te[8]*be[10]+te[12]*be[11];
        var n23=te[1]*be[8]+te[5]*be[9]+te[9]*be[10]+te[13]*be[11];
        var n33=te[2]*be[8]+te[6]*be[9]+te[10]*be[10]+te[14]*be[11];
        var n43=te[3]*be[8]+te[7]*be[9]+te[11]*be[10]+te[15]*be[11];

        var n14=te[0]*be[12]+te[4]*be[13]+te[8]*be[14]+te[12]*be[15];
        var n24=te[1]*be[12]+te[5]*be[13]+te[9]*be[14]+te[13]*be[15];
        var n34=te[2]*be[12]+te[6]*be[13]+te[10]*be[14]+te[14]*be[15];
        var n44=te[3]*be[12]+te[7]*be[13]+te[11]*be[14]+te[15]*be[15];
        return new Matrix(n11,n12,n13,n14,
                        n21,n22,n23,n24,
                        n31,n32,n33,n34,
                        n41,n42,n43,n44);
	}
    
    // get the translation/positional componenet out of the matrix
    getPosition(): Vector {
        var e=this.elements;
        return new Vector(e[12],e[13],e[14]);
    }
    
    // get the x, y and z vectors out of the rotation part of the matrix
    getXVector(): Vector {
        var e=this.elements;
        return new Vector(e[0],e[1],e[2]);
    }
    getYVector(): Vector {
        var e=this.elements;
        return new Vector(e[4],e[5],e[6]);
    }
    getZVector(): Vector {
        var e = this.elements;
        return new Vector(e[8],e[9],e[10]);
    }
    
    // utility if you want to print it out
    toString(): string {
        var te = this.elements;
        return "[" + 
    		te[ 0 ] + ", " + te[ 4 ] + ", " + te[ 8 ] + ", " + te[ 12 ] + ",\n" +
		    te[ 1 ] + ", " + te[ 5 ] + ", " + te[ 9 ] + ", " + te[ 13 ] + ",\n" +
		    te[ 2 ] + ", " + te[ 6 ] + ", " + te[ 10 ]+ ", " + te[ 14 ] + ",\n" +
		    te[ 3 ] + ", " + te[ 7 ] + ", " + te[ 11 ]+ ", " + te[ 15 ] + "]";  
    }
}

export class Thing {
    // the children of the node, and the parent
    children: Thing[];
    parent: Thing | null;
    
    
    position: Vector;
    rotation: Matrix;
    scale: Vector;
    
    
    transform: Matrix;

    inverseTransform: Matrix;

    worldTransform: Matrix;
        
    constructor() {
        this.position = new Vector(0,0,0);
        this.rotation = Matrix.identity();
        this.scale = new Vector(1,1,1);
        
        this.parent = null;
        this.children = new Array();
        this.transform = Matrix.identity();
        this.inverseTransform = Matrix.identity();
        this.worldTransform = Matrix.identity();

    }


    add(c: Thing) {
        this.children.push(c);
        if (c.parent) {
            c.parent.remove(c);
        }
        c.parent = this;
    }    
    remove(c: Thing) {        
		var index = this.children.indexOf( c );

		if ( index !== - 1 ) {
			c.parent = null;
			this.children.splice( index, 1 );        
        }
    }

    // compute transform from position * rotation * scale and inverseTransform from their inverses 
    computeTransforms() {
        
        var posTrans=Matrix.makeTranslation(this.position);
        var scale=Matrix.makeScale(this.scale);
        this.transform=posTrans.multiply(this.rotation).multiply(scale);

        var rotationInverse = Matrix.transpose(this.rotation);
        var scaleInverse=new Matrix(1/this.scale.x, 0, 0, 0, 
                                    0, 1/this.scale.y, 0, 0, 
                                    0, 0, 1/this.scale.z, 0, 
                                    0, 0, 0, 1);
        var posInverse = new Matrix(1, 0, 0, -this.position.x, 
                            0, 1, 0, -this.position.y, 
                            0, 0, 1, -this.position.z, 
                            0, 0, 0, 1);
        this.inverseTransform=scaleInverse.multiply(rotationInverse).multiply(posInverse);
        

        //this.transform = Matrix.makeTranslation(this.position).multiply(this.rotation.multiply(Matrix.makeScale(this.scale)));
        //this.inverseTransform = Matrix.makeScale(new Vector(1 / this.scale.x, 1 / this.scale.y, 1 / this.scale.z)).multiply(Matrix.transpose(this.rotation).multiply(Matrix.makeTranslation(new Vector(-this.position.x, -this.position.y, -this.position.z))));
    }    
        
    // traverse the graph, executing the provided callback on this node and it's children
	traverse ( callback: (obj: Thing ) => void ) {
        callback(this);
        this.children.forEach(c=>{
            c.traverse(callback);
        }); 
	}
}

// The Thing that puts something on the screen is the HTMLDivThing.    
// The HTMLDivThing is simply a holder for the div being manipulated by the library.
// By having it be a class, we can recognize when a node is one of these and handle appropriately
export class HTMLDivThing extends Thing {
    constructor(public div: HTMLDivElement) {
        super();
    	this.div.style.position = 'absolute';        
    }
}

// The Camera Thing.  There must be one and only one in the Scene.
export class Camera extends Thing {
    // hint:  you will need to figure out and keep track of the inverse transform from
    // the camera up to the root of the scene.  
    worldInverseTransform: Matrix;
    
    constructor(public fovy: number) {
        super();
		this.worldInverseTransform = Matrix.identity();
    }
    
    // get the focal length (distance from the viewplane) for a window of a specified
    // height and the camera's fovy    
    getFocalLength (height: number): number {
        var rad = degToRad(this.fovy/2);
        var fl = (height/2)*Math.cos(rad)/Math.sin(rad);
        return fl;
        
    }
}
 
// A scene
export class Scene {
    world: Thing;
    camera: Camera | null;
    
    // internal
    private domElement: HTMLDivElement;
    private width: number;
    private height: number;
    private windowTransform: string;

                
    constructor(public container: HTMLDivElement) {
        this.world = new Thing();
        this.camera = null;

        this.domElement = document.createElement( 'div' );

        // uncomment this to clip the contents of the domElement to the boundaries of the 
        // domElement; otherwise, div's can go outside of it's boundaries (useful for 
        // debugging!)

        //this.domElement.style.overflow = 'hidden';

        // set the transform-style to "preserve-3d" so the 3D values inherit
        this.domElement.style.transformStyle = "preserve-3d";

        // add our new DOM element to the provided container
        this.container.appendChild(this.domElement);
       
        // get the size of the provided container, and set our DOM element to it's size       
        var rect = container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
		this.domElement.style.width = this.width + 'px';
        this.domElement.style.height = this.height + 'px';

        this.windowTransform = "matrix3d(1,0,0,0, 0,-1,0,0, 0,0,1,0, 0,0,0,1)" +
            " translate3d(" + this.width/2 + 'px, ' + this.height/2 + 'px, 0px)'; 
    }
    
    getObjectCSSMatrix( m: Matrix ): string {
		var elements = m.elements;

		return 'translate3d(-50%, -50%, 0) matrix3d(' +
			epsilon( elements[ 0 ]  ) + ',' +
			epsilon( elements[ 1 ]  ) + ',' +
			epsilon( elements[ 2 ]  ) + ',' +
			epsilon( elements[ 3 ]  ) + ',' +
			epsilon( - elements[ 4 ]  ) + ',' +
			epsilon( - elements[ 5 ]  ) + ',' +
			epsilon( - elements[ 6 ]  ) + ',' +
			epsilon( - elements[ 7 ]  ) + ',' +
			epsilon( elements[ 8 ]  ) + ',' +
			epsilon( elements[ 9 ]  ) + ',' +
			epsilon( elements[ 10 ]  ) + ',' +
			epsilon( elements[ 11 ]  ) + ',' +
			epsilon( elements[ 12 ]  ) + ',' +
			epsilon( elements[ 13 ]  ) + ',' +
			epsilon( elements[ 14 ]  ) + ',' +
			epsilon( elements[ 15 ]  ) +
		')';
	};
    
    render() {    
        var updateMatricies = (obj: Thing) => {
            obj.computeTransforms();
            if(obj.parent){
                obj.worldTransform=obj.parent.transform.multiply(obj.transform);
            }else{
                obj.worldTransform=obj.transform;
            } 
            if(obj instanceof Camera){
                
                this.camera=obj;
                this.camera.worldInverseTransform = this.camera.inverseTransform;
                
                var curr=this.camera.parent;
                while(curr) {
                    obj.worldInverseTransform = obj.worldInverseTransform.multiply(curr.inverseTransform)
                    curr=curr.parent;
                }

                //view 
                var focalLength = this.camera.getFocalLength(this.height).toString();
                this.container.style.perspective = focalLength + "px";
                this.domElement.style.transform="translate3d(0px,0px,"+focalLength+"px)"+this.windowTransform;
                
            }
            
        }
       

        var renderThings = (obj: Thing) => {
            if(this.camera ){
                if(obj instanceof HTMLDivThing){
                    var trans = this.camera.worldInverseTransform.multiply(obj.worldTransform);
                    const transformstr = this.getObjectCSSMatrix(trans);
                    obj.div.style.transform=transformstr;
                    this.domElement.appendChild(obj.div);
                }   
            }
        }
        
        this.world.traverse(updateMatricies);
        this.world.traverse(renderThings);
       
        
    }
}