import {
	BufferGeometry,
	Float32BufferAttribute,
	LineSegments,
	LineBasicMaterial,
	Matrix3,
	Vector3
} from 'three';

import * as THREE from 'three';


//let mapCoordsRaw = [[1,1.4],[2,1.4],[2,0.4],[1,0.4]];
//let R,Vstep, Hstep, window_w, window_h, winxcnt ,winycnt ,fact ,mag;


//-----------------------------------------
// add mode flat sphere
// if flat set fi/theta as 0 and keep x,y, z=0
// modes 0 - sphere
// mode 1 - flat
class MapCoord {
	constructor(fi, theta, R, mode = 0){
		this.fi = fi;
		this.theta = theta;
		this.mode = mode;
		// sphere coordinates
		if (mode == 0) {
			this.x = R * Math.cos(theta) * Math.cos(fi);
			this.y = R * Math.cos(theta) * Math.sin(fi);
			this.z = R * Math.sin(theta);
		}

		if (mode == 1){
			this.fi = 0;
			this.theta = 0;
			this.x = -fi * 200.0 + 85;
			this.y = -theta * 200.0 + 85;
			this.z = R*0.8;
		}

		this.spotx = this.x;
		this.spoty = this.y;
		this.spotz = this.z;

		// this is in screen space. We have a z just in case we move 3d
		this.sx = this.x;
		this.sy = this.y;
		this.sz = this.y;

		this.friends = [];
		this.is_friend = false;

		// need an autoincrement here
		this.id = ProjectionMapData.indexCounter++;

		this.speed = 0.0;//Math.sin((this.fi+this.theta)/2.0)/4.0;

		this.directionx = 0.0;
		this.directiony = 0.0;
		this.directionz = 0.0;

		this.favgx = 0.0;
		this.favgy = 0.0;

		this.type = 0;

	}				
};

class ProjectionMapData {
	constructor(x,y,amp,square_size_x,square_size_y,hstep,vstep,offset_x,offset_y, window_w, window_h){
		this.x = x;
		this.y = y;

		this.amp = amp;

		this.square_size_x = square_size_x;
		this.square_size_y = square_size_y;

		this.vstep = vstep;
		this.hstep = hstep;

		this.offset_x = offset_x;
		this.offset_y = offset_y;

		this.window_w = window_w;
		this.window_h = window_h;
	}


}

class LbMap {
	static indexCounter = 0;

	particles;
	particlesMap;			
	square_group;
	square_surface_group;
	square_flat_group;
	square_flat_surface_group;
	radius_group;

	friends_group; // not used


	square_list = [];
	square_flat_list = [];	
	square_flat_surface_list = [];	
	
	square_surface_list = [];
	map_lines_list = [];
	friends_line_list = [];


	mapCoords = [];
	activeMapCoords = [];
	

	mapCoordsRaw = [[36.86622999999997,22],[32.89999999999998,22],[29.019999999999982,22],[25,22],[25,25.682499996361],[25,29.23865452953346],[24.70007,30.044190000000004],[24.957620000000002,30.6616],[24.802869999999984,31.089290000000005],[25.16482,31.56915],[26.49533,31.58568],[27.457620000000002,31.32126],[28.450480000000002,31.025769999999998],[28.913529999999998,30.87005],[29.683419999999998,31.186860000000003],[30.09503,31.4734],[30.976930000000003,31.55586],[31.687960000000004,31.4296],[31.96041,30.933600000000002],[32.19247,31.26034],[32.99392,31.024070000000002],[33.7734,30.967460000000003],[34.26543474464621,31.21935730952032],[34.265440000000005,31.219359999999998],[34.823243288783814,29.76108076171822],[34.9226,29.50133],[34.64174,29.099420000000002],[34.42655,28.343989999999998],[34.15451,27.8233],[33.92136,27.6487],[33.58811,27.97136],[33.13676,28.417650000000002],[32.423230000000004,29.851080000000003],[32.32046,29.76043],[32.73482,28.70523],[33.34876,27.69989],[34.10455,26.14227],[34.473870000000005,25.598560000000003],[34.79507,25.03375],[35.69241,23.92671],[35.49372,23.752370000000003],[35.52598,23.10244],[36.690690000000004,22.20485],[36.86622999999997,22]];
	mapCoordsRaw1 = [[147.68925947488418,-40.808258152022674],[148.289067824496,-40.87543751400211],[148.35986453673587,-42.06244516374644],[148.01730146707303,-42.40702361426865],[147.91405195535384,-43.211522312188535],[147.56456424376393,-42.937688897473905],[146.87034305235488,-43.6345972633621],[146.66332726459365,-43.58085377377856],[146.04837772032033,-43.549744561538844],[145.4319295595106,-42.693776137056254],[145.29509036680173,-42.033609714527564],[144.71807132383066,-41.16255177181576],[144.7437545106797,-40.70397511165767],[145.3979781434948,-40.79254851660594],[146.3641207216237,-41.13769540788336],[146.90858361225088,-41.00054615658073],[147.68925947488418,-40.808258152022674],[126.14871382050114,-32.21596607842059],[125.08862348846566,-32.72875131605285],[124.22164798390492,-32.95948658623607],[124.02894656788851,-33.4838473447017],[123.65966678273077,-33.89017913181271],[122.81103641163364,-33.914467054989885],[122.1830644064228,-34.0034021949642],[121.29919070850259,-33.821036065406176],[120.58026818245806,-33.93017669040661],[119.89369510302822,-33.9760653622818],[119.29889936734875,-34.50936614353394],[119.00734093635802,-34.46414926527854],[118.5057178081008,-34.74681934991509],[118.02497195848949,-35.0647327613747],[117.29550744025741,-35.02545867283287],[116.62510908413495,-35.02509693780683],[115.56434695847966,-34.38642791111157],[115.02680870977957,-34.19651702243893],[115.04861616420676,-33.623425388322055],[115.54512332566708,-33.48725798923297],[115.7146737000167,-33.25957162855497],[115.67937869676135,-32.900368747694166],[115.80164513556394,-32.205062351207005],[115.68961063035516,-31.612437025683807],[115.160909051577,-30.601594333622465],[114.99704308477948,-30.03072478609414],[115.04003787644629,-29.46109547294082],[114.64197431850201,-28.81023080822467],[114.6164978373821,-28.51639861421308],[114.17357913620847,-28.11807667410732],[114.04888390508816,-27.334765313427106],[113.47749759323692,-26.543134047147902],[113.33895307826242,-26.116545098578484],[113.77835778204022,-26.549025160429174],[113.44096235560656,-25.621278171493167],[113.93690107631167,-25.91123463308287],[114.23285200404723,-26.29844614024588],[114.21616051641698,-25.786281019801123],[113.7212553243577,-24.99893889740214],[113.62534386602397,-24.683971042583167],[113.39352339076264,-24.384764499613226],[113.5020438985756,-23.806350192970285],[113.70699262904515,-23.56021534596409],[113.84341841029567,-23.059987481378755],[113.73655154831609,-22.47547535572538],[114.1497563009219,-21.75588103606104],[114.22530724493262,-22.517488295178673],[114.6477620789187,-21.829519952076954],[115.46016727097924,-21.495173435148537],[115.94737267462702,-21.068687839443704],[116.71161543179153,-20.701681817306824],[117.16631635952771,-20.623598728113805],[117.44154503791424,-20.74689869556221],[118.229558953933,-20.37420826587322],[118.83608523974274,-20.263310642174858],[118.98780724495168,-20.044202569257315],[119.25249393115067,-19.952941989829867],[119.80522505094451,-19.976506442954964],[120.85622033089668,-19.683707777589206],[121.39985639860717,-19.239755547769725],[121.65513797412902,-18.70531788500717],[122.24166548064179,-18.197648614171804],[122.28662397673571,-17.798603204013958],[122.3127722514754,-17.25496713630345],[123.01257449757193,-16.405199883695886],[123.43378909718304,-17.268558037996215],[123.85934451710659,-17.069035332917288],[123.50324222218329,-16.596506036040402],[123.81707319549184,-16.111316013252],[124.25828657439985,-16.327943617419535],[124.37972619028575,-15.56705982835399],[124.92615278534004,-15.07510019293536],[125.16727501841387,-14.680395603090028],[125.67008670461381,-14.510070082256014],[125.68579634003055,-14.23065561285385],[126.12514936737608,-14.347340996968903],[126.14282270721986,-14.095986830301227],[126.58258914602374,-13.952791436420448],[127.06586714081732,-13.817967624570954],[127.80463341686196,-14.27690601975508],[128.35968997610894,-14.869169610252243],[128.98554324759584,-14.875990899314765],[129.62147342337965,-14.969783623924522],[129.40960005098293,-14.42066985439107],[129.8886405783286,-13.618703301653492],[130.33946577364293,-13.357375583553484],[130.18350630098604,-13.107520033422276],[130.61779503796697,-12.536392103732489],[131.22349450086,-12.183648776908166],[131.73509118054955,-12.302452894747184],[132.5752982931831,-12.114040622611007],[132.55721154188097,-11.603012383676678],[131.82469811414364,-11.27378183354515],[132.3572237489114,-11.128519382372696],[133.01956058159635,-11.376411228076812],[133.55084598198908,-11.786515394745116],[134.39306847548204,-12.042365411022182],[134.67863244032696,-11.941182956594693],[135.29849124566795,-12.248606052299046],[135.8826933127276,-11.962266940969776],[136.2583809754895,-12.049341729381588],[136.49247521377168,-11.857208754120398],[136.951620314685,-12.351958916882793],[136.6851249533558,-12.887223402562022],[136.3054065288751,-13.291229750219884],[135.96175825413417,-13.324509372615852],[136.07761681533253,-13.724278252825783],[135.78383629775323,-14.2239893530882],[135.4286641786112,-14.715432224183912],[135.50018436090318,-14.997740573794424],[136.2951745952813,-15.55026498785913],[137.06536014215942,-15.87076222093333],[137.5804708192448,-16.21508228929408],[138.30321740127897,-16.807604261952704],[138.58516401586343,-16.806622409739155],[139.10854292211548,-17.06267913174539],[139.2605749859182,-17.371600843986208],[140.21524539607827,-17.710804945550066],[140.87546349503924,-17.369068698803908],[141.07111046769626,-16.83204721442676],[141.27409549373874,-16.38887013109165],[141.39822228410384,-15.840531508042588],[141.70218305884464,-15.044921156476901],[141.56338016170866,-14.561333103089552],[141.6355204611881,-14.270394789286307],[141.5198686057189,-13.698078301653808],[141.65092003801107,-12.944687595270585],[141.8426912782462,-12.741547539931231],[141.68699018775084,-12.407614434461145],[141.9286291851476,-11.877465915578817],[142.11848839738798,-11.328042087451612],[142.1437064963464,-11.042736504768186],[142.51526004452495,-10.668185723516686],[142.797310011974,-11.157354831591562],[142.86676313697427,-11.784706719614903],[143.11594689348573,-11.905629571177885],[143.15863162655876,-12.325655612846232],[143.5221236512998,-12.834358412327433],[143.5971578309876,-13.400422051652612],[143.5618111513,-13.763655694232192],[143.9220992372389,-14.548310642151996],[144.56371382057483,-14.171176039285903],[144.89490807513346,-14.594457696188641],[145.3747237489635,-14.98497649501833],[145.27199100156724,-15.428205254785732],[145.4852596376358,-16.28567229580478],[145.637033319277,-16.78491830817657],[145.88890425026761,-16.906926364817686],[146.16030887266453,-17.761654554925272],[146.06367394427872,-18.28007252367734],[146.38747846901964,-18.958274021075887],[147.4710815777479,-19.48072275154673],[148.17760176004242,-19.9559392229028],[148.84841352762322,-20.391209812097244],[148.71746544819558,-20.63346892668155],[149.28942020080206,-21.260510756111135],[149.6783370302307,-22.342511895438385],[150.07738244038853,-22.122783705333337],[150.48293908101516,-22.556142266532994],[150.72726525289113,-22.402404880464665],[150.89955447815225,-23.462236830338696],[151.60917524638427,-24.07625619883074],[152.07353966695905,-24.457886651306225],[152.8551973818059,-25.267501316023],[153.1361621441768,-26.071173191026215],[153.16194868389044,-26.641319268502457],[153.0929089703485,-27.260299574494514],[153.56946902894418,-28.11006682710208],[153.51210818910022,-28.99507740653271],[153.339095493787,-29.45820159273248],[153.06924116435886,-30.350240166954794],[153.08960167868184,-30.923641859665423],[152.89157759013938,-31.640445651986],[152.45000247620533,-32.550002536755265],[151.70911746643674,-33.041342054986394],[151.3439717958624,-33.81602345147387],[151.0105554547152,-34.31036020277793],[150.71413943908902,-35.173459974916796],[150.3282198427333,-35.671879164371916],[150.0752120302323,-36.42020558039054],[149.9461243023672,-37.10905242284121],[149.99728397033613,-37.42526051203518],[149.42388227762552,-37.77268116633344],[148.30462243061584,-37.809061374666925],[147.38173302631526,-38.21921721776752],[146.92212283751132,-38.606532077795116],[146.31792199115478,-39.03575652441141],[145.4896521343806,-38.59376799901902],[144.87697635312816,-38.41744801203915],[145.03221235573295,-37.89618783951102],[144.48568240781407,-38.085323581699285],[143.60997358619602,-38.8094654274053],[142.74542687395297,-38.538267510737555],[142.17832970598192,-38.380034275059835],[141.60658165910468,-38.30851409276788],[140.63857872941327,-38.019332777662555],[139.99215823787426,-37.402936293285094],[139.8065881695141,-36.64360279718831],[139.57414757706528,-36.13836231867066],[139.08280805883413,-35.732754001611745],[138.12074791885635,-35.61229623793939],[138.44946170466494,-35.127261244447865],[138.20756432510672,-34.38472258884593],[137.71917036351618,-35.076825046531],[136.8294055523147,-35.26053476332861],[137.35237104710848,-34.7073385556441],[137.50388634658827,-34.13026783624075],[137.8901160015377,-33.64047861097838],[137.81032759007905,-32.90000701266812],[136.9968371929404,-33.752771498348615],[136.37206912653164,-34.094766127256236],[135.98904341038428,-34.89011809666046],[135.20821251845405,-34.478670342752565],[135.23921837782916,-33.94795338311502],[134.6134167827746,-33.222778008763164],[134.08590376193916,-32.84807219821479],[134.27390262261702,-32.61723357516699],[132.99077680880976,-32.01122405368019],[132.28808068250487,-31.982646986622782],[131.32633060112084,-31.49580331800104],[129.53579389863972,-31.590422865527465],[128.24093753470225,-31.948488864877852],[127.1028674663383,-32.28226694105106],[126.14871382050114,-32.21596607842059]];
	defIndexh = 0;
	defIndexv = 0;
	defIndexfi = 0;
	defIndextheta = 0;
	prjMapData;

	// rendering extras
	uniforms;
	shaderMaterial;
	shaderMaterialCanvas;

	pointsMap = [];
	geometryMap = new THREE.BufferGeometry();
	colors = [];
	sizes = [];
	right_friend = [];
	color = new THREE.Color();
	rfcolor;

	// 
	autofit = false;
	
	// final output ratio
	out_scr_w = 0;
	out_scr_h = 0;

	phi_cover = 0;
	theta_cover = 0;
	maxvindex = 0;
	initialized = false;
	activeInitialized = false;

	delaunyMap;

	hide_squares = false;
	hide_delaunay = false;
	rotate_squares = true;
	render_delaunay_wireframe = true;			

	friend_mode = 2;
	arrayOfMaps = [];

	show_friend_idx = 0;

	friends_group = new THREE.Group();

	totalelapsed = 0;

	constructor(scene,object ,R, Vstep, Hstep, window_w, window_h, winxcnt ,winycnt ,fact ,mag, phi_cover, theta_cover){
		this.scene = scene;
		this.object = object;
		this.R = R;
		this.Vstep = Vstep;
		this.Hstep = Hstep;
		this.window_h = window_h;
		this.window_w = window_w;
		this.winxcnt = winxcnt;
		this.winycnt = winycnt;
		this.fact = fact;
		this.mag = mag;		

		this.phi_cover = phi_cover;
		this.theta_cover = theta_cover;

		this.scene.add(this.friends_group);
	}

	factory () {
		//console.log("Factory " +this.winxcnt + " " + this.winycnt + " " + this.fact + " " + this.mag + " " + this.Hstep + " " + this.Vstep + " " + this.window_w + " " + this.window_h);
		this.prjMapData = new ProjectionMapData(this.winxcnt,this.winycnt,this.mag,this.window_w*this.fact,this.window_h*this.fact,
			this.Hstep,this.Vstep,-this.window_w*this.winxcnt/2,this.window_h*this.winycnt/4, this.window_w,this.window_h);
	}

	setScrSize(w, h){
		this.out_scr_h = h;
		this.out_scr_w = w;
	}
	
	parsePolygonCoords(polygonString, mode) {
		// Remove the "POLYGON " prefix and split the string into polygons
		//prefix may be POLYGON or MultyPolygon
		
		const firstParenthesisPosition = polygonString.indexOf('(');
		console.log ("Polygon type: " + mode);

		console.log (firstParenthesisPosition);
		const polygons = polygonString.slice(firstParenthesisPosition+1).split('), (');
		// Map each polygon string to an array of MapCoords objects
		const mapCoordsArrays = polygons.map(polygonString => {
			// Remove the leading and trailing parentheses
			const coordsString = polygonString.slice(1, -2);
			// Split the coordinates string into an array of strings
			const coordsArray = coordsString.split(',');
			// Map each string to a MapCoords object
			console.log ("SplitcoordsArray");
			return coordsArray.map(coordString => {
				
				const sanitizedCoordStringF = coordString.substring(0,1) === '(' ? coordString.slice(1) : coordString;
								
				const trimmedCoordString = sanitizedCoordStringF.trim();
				const lastCharacter = trimmedCoordString.slice(-1);
				const sanitizedCoordString = lastCharacter === ')' ? trimmedCoordString.slice(0, -1) : trimmedCoordString;
				
				const [x, y] = sanitizedCoordString.trim().split(' ').map(Number);
				console.log("x:" + x +" y:" + y);
				var mapCoord = new MapCoord( x*(Math.PI)/180.0, y*(Math.PI)/(180.0), this.R, mode);
				return mapCoord;
			});
		});
	  
		return mapCoordsArrays;
	}

	init(){
		
		console.log(this.mapCoords);
		console.log(this.defIndexv);

		this.uniforms = {
			pointTexture: { value: new THREE.TextureLoader().load( 'textures/sprites/spark1.png' ) }
		};

		this.shaderMaterial = new THREE.ShaderMaterial( {

			uniforms: this.uniforms,
			vertexShader: document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
			vertexColors: true

		} );

		this.shaderMaterialCanvas = new THREE.ShaderMaterial( {

			uniforms: this.uniforms,
			vertexShader: document.getElementById( 'vertexshader_canvas' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader_canvas' ).textContent,

			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
			vertexColors: true

		} );

		this.defineShaderSurfaceDelauny();
		
		this.factory();		

		this.square_surface_group = new THREE.Group();
		this.square_flat_group = new THREE.Group();
		this.square_flat_surface_group = new THREE.Group();
		
	}

	defineShaderSurfaceDelauny(){
		this.shaderMaterialSurface = new THREE.ShaderMaterial( {

			uniforms: this.uniforms,
			vertexShader: document.getElementById( 'vertexshader_surface' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader_surface' ).textContent,			
			vertexColors: true,
			wireframe: this.render_delaunay_wireframe

		} );	
	
	}

	initMapData(mapdata, mode = 0) {		
		const tmparraymaps = this.parsePolygonCoords(mapdata, mode);
		const newMapCoords = tmparraymaps.flat();
		
		const deepCopyTmpArrayMaps = JSON.parse(JSON.stringify(tmparraymaps));

		for (let i = 0; i < deepCopyTmpArrayMaps.length; i++) {
			this.arrayOfMaps.push(deepCopyTmpArrayMaps[i].slice());
		}

		this.mapCoords = this.mapCoords.concat(newMapCoords);

		this.rebuildMapData();
	}


	 generateLinePolynomial(polygon) {
		// polygon is a list of MapCoords objects	
		const geometry = new THREE.BufferGeometry();
		
		// this one will eat the original 
		geometry.setFromPoints( polygon );

		// Return the line polynomial
		const material = new THREE.LineBasicMaterial( { color: 0x2222ff } );										
		const linePolynomial = new THREE.Line( geometry, material );	
		this.map_lines_list.push(linePolynomial);

		this.object.add(linePolynomial);

		return linePolynomial;
	}

	generateLineMap(arrayOfMaps) {
		this.linePolynomials = this.arrayOfMaps.map(polygon => this.generateLinePolynomial(polygon));
	}


	rebuildMapData(mapdata) {
		this.object.remove(this.particles);
		

		this.object.remove(this.square_group);

		this.scene.remove(this.radius_group);

		this.particles = this.generateMap();


		for (var n = 0;n<this.map_lines_list.length;n++){	
			this.map_lines_list[n].geometry.dispose();							
			this.object.remove(this.map_lines_list[n]);
		}
		
		this.generateLineMap(this.arrayOfMaps);

		this.square_group = this.generateWindows();
		this.regeneratemap(true);
		
		this.object.add(this.particles);

		this.object.add(this.square_group);
	}

	regeneratemap(regen){
		if (!regen)
			return this.generateProjectionMap(regen);
		else{

			if (this.initialized) {
				this.particlesMap.geometry.dispose();
				this.scene.remove( this.particlesMap );									
			}

			this.particlesMap = this.generateProjectionMap(regen);
			this.particlesMap.position.z = 260;
			this.scene.add( this.particlesMap );
			this.initialized = true;
		}
	}

	/**
	 * 
	 * This is not finished!! - regen not properly  implemented
	 * 	 */
	regenerateSphereMap(regen){
		// clean-up
		for (var n = 0;n<this.square_list.length;n++){

			this.square_list[n].geometry.dispose();
			this.square_surface_list[n].geometry.dispose();				
			this.square_flat_list[n].geometry.dispose();
			this.square_flat_surface_list[n].geometry.dispose();

			this.square_group.remove(this.square_list[n]);						
			this.square_surface_group.remove(this.square_surface_list[n]);									
			this.square_flat_group.remove(this.square_flat_list[n]);
			this.square_flat_surface_group.remove(this.square_flat_surface_list[n]);
		}

		this.square_list = [];
		this.square_surface_list = [];
		this.square_flat_list = [];
		this.square_flat_surface_list = [];

		this.map_lines_list = [];
		

		if (this.hide_squares){
			this.scene.remove(this.square_flat_group);
			this.scene.remove(this.square_flat_surface_group);			
			//this.scene.remove(this.square_surface_group);
		}

		this.object.remove(this.square_group);
		this.square_group = this.generateWindows();
		this.object.add(this.square_group);	

		//this.scene.add(this.square_surface_group);

		if (!this.hide_squares)	{	
			this.scene.add(this.square_flat_group);
			this.scene.add(this.square_flat_surface_group);			
			//this.scene.add(this.square_surface_group);
		}
	}
	
	get particles (){
		return this.particles;
	}

	get particlesMap (){
		return this.particlesMap;
	}

	get square_group (){
		return this.square_group;
	}

	cartesianToSpehrical(i, positionAttribute){
		var theta = Math.acos(positionAttribute.getZ(i) / this.R);
		var fi = Math.atan2(positionAttribute.getY(i), positionAttribute.getX(i));
		return {fi: fi, theta: theta};
	}

	isPointInsidePolygon(point, polygonPoints) {
		let x = point[0], y = point[1];
	
		let inside = false;
		for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
			let xi = polygonPoints[i][0], yi = polygonPoints[i][1];
			let xj = polygonPoints[j][0], yj = polygonPoints[j][1];
	
			let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}
	
		return inside;
	}

	toScreenPosition(vec,kx,ky){
		const amp = this.prjMapData.amp;
		const map_square_size_x = this.prjMapData.square_size_x;
		const map_square_size_y = this.prjMapData.square_size_y;		
		const ratio_x = this.out_scr_w/(map_square_size_x * this.prjMapData.y);
		const ratio_y = this.out_scr_h/(map_square_size_y * this.prjMapData.x);
	
		const vdest = new THREE.Vector3(
			amp * ratio_x * (-vec.x - map_square_size_x*(kx-this.defIndexv) + map_square_size_x * (this.prjMapData.y -1)/2.0) , 
			amp * ratio_y * (vec.y - map_square_size_y*(ky-this.defIndexh) + map_square_size_y * (this.prjMapData.x -1)/2.0) ,
			vec.z );

		return vdest;
	}

	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}


	setFriends(fcount,i,tolerance) {
		var fmin = 10000;

		var f_int_min = 0;
		var f_int_max = 0;
		
		if (this.activeMapCoords.length <= i) return ;

		// reset all activeCoords friends
		if (i==0)
		for ( var k = 0; k < this.activeMapCoords.length; k++ ) {
			var j = this.activeMapCoords[k].j;
			var b = this.mapCoords[j];
			b.friends = [];
		}

		var a = this.mapCoords[this.activeMapCoords[i].j];
		
		let mapCoords = this.mapCoords;
		let activeMapCoords = this.activeMapCoords;

		function compareNumbers(x, y) {
			let _a = mapCoords[activeMapCoords[x].j];
			let _b = mapCoords[activeMapCoords[y].j];
			let reper = mapCoords[activeMapCoords[i].j];
			let _aDistance = Math.sqrt((_a.sx-reper.sx)* (_a.sx-reper.sx) + (_a.sy-reper.sy)* (_a.sy-reper.sy));
			let _bDistance = Math.sqrt((_b.sx-reper.sx)* (_b.sx-reper.sx) + (_b.sy-reper.sy)* (_b.sy-reper.sy));
			return _aDistance - _bDistance;
		}

		// get the min from exisintg friends
		if (a.friends.length > 0){
			a.friends.sort(compareNumbers);
			let _b =  this.mapCoords[this.activeMapCoords[a.friends[a.friends.length-1]].j];
			let _b1= this.mapCoords[this.activeMapCoords[a.friends[0]].j];

			// only set fmin if full backet
			if (a.friends.length >= fcount)
				fmin = Math.sqrt((a.sx-_b.sx)* (a.sx-_b.sx) + (a.sy-_b.sy)* (a.sy-_b.sy));
			
			if (i==this.show_friend_idx){
				f_int_max = Math.sqrt((a.sx-_b1.sx)* (a.sx-_b1.sx) + (a.sy-_b1.sy)* (a.sy-_b1.sy));
				f_int_min = Math.sqrt((a.sx-_b.sx)* (a.sx-_b.sx) + (a.sy-_b.sy)* (a.sy-_b.sy));
				console.log("fmin fintmin fintmax " + fmin + " " + f_int_min + " " + f_int_max);
			}		
		}

		for ( var k = i + 1; k < this.activeMapCoords.length; k++ ) {
			var j = this.activeMapCoords[k].j;
			var b = this.mapCoords[j];
			const aDistance = Math.sqrt((a.sx-b.sx)* (a.sx-b.sx) 
			+ (a.sy-b.sy)* (a.sy-b.sy));

			a.type = 10;

			// do not evaluate as friend but within tolerance
			//if (aDistance > tolerance)
			//		continue;

			//if (i==this.show_friend_idx)
			//	console.log ("Compare i" + i + " with j " + k + " " + aDistance + " fmin " + fmin + " tol: " + tolerance) ;

			// if within the already existing friends
			if ((aDistance<fmin) && (aDistance < tolerance)){ 
				//if (i==this.show_friend_idx) 
				//	console.log("PUSH:" + k + " Dist: " + aDistance);
				
				a.friends.push(k);  // this is the index from activeMapCoords
				a.type = i;
				
				if (a.friends.length < fcount) {
					//console.log("distance" + aDistance);
					if (a.friends.length == fcount - 1){
						//fmin = aDistance;
						a.friends.sort(compareNumbers);	
						
						let _b =  this.mapCoords[this.activeMapCoords[a.friends[a.friends.length-1]].j];					
						fmin = Math.sqrt((a.sx-_b.sx)* (a.sx-_b.sx) + (a.sy-_b.sy)* (a.sy-_b.sy));						

						//if (i==this.show_friend_idx)
						//	console.log("New fmin : " + fmin + " len" + a.friends.length + "(1)");
					}

				} else {
					// only update fmin if full backet
					a.friends.sort(compareNumbers);
					let _b =  this.mapCoords[this.activeMapCoords[a.friends[a.friends.length-1]].j];					

					fmin = Math.sqrt((a.sx-_b.sx)* (a.sx-_b.sx) + (a.sy-_b.sy)* (a.sy-_b.sy));

					//if (i==this.show_friend_idx) console.log("New fmin : " + fmin + " len" + a.friends.length + "(2)");

					a.friends.pop();

					//if (i==this.show_friend_idx) console.log("POP");
				}		

				//if (i==this.show_friend_idx) {
				//	console.log(a.friends + " fmin : " + fmin + " len" + a.friends.length);				
				//}
			}else{
			//	console.log("NEVER HIT");
			}									
		}

		if (i==this.show_friend_idx) {
			//console.log(" i " + i + "Final : " + a.friends + " found: " + a.friends.length +  " act i" + this.activeMapCoords[i].j);
			//console.log(a.friends);
			//this.displayFriendsDistanceFrom(i);
		}
		
		a.friends.forEach((idx) => {
			this.safe_push_friend(i,idx,fcount); 
		});	
	
		if (i==this.show_friend_idx) {
			//console.log(" i " + i + "Final 2: " + a.friends + " found: " + a.friends.length +  " act i" + this.activeMapCoords[i].j);
			//console.log(a.friends);
			//this.displayFriendsDistanceFrom(i);
		}

		if (i+1<this.activeMapCoords.length)
			this.setFriends(fcount,i+1,tolerance);			
	}

	safe_push_friend(i,idx,fcount){
		let mapCoords = this.mapCoords;
		let activeMapCoords = this.activeMapCoords;

		function compareNumbers(x, y) {
			let _a = mapCoords[activeMapCoords[x].j];
			let _b = mapCoords[activeMapCoords[y].j];
			let reper = mapCoords[activeMapCoords[idx].j];
			let _aDistance = Math.sqrt((_a.sx-reper.sx)* (_a.sx-reper.sx) + (_a.sy-reper.sy)* (_a.sy-reper.sy));
			let _bDistance = Math.sqrt((_b.sx-reper.sx)* (_b.sx-reper.sx) + (_b.sy-reper.sy)* (_b.sy-reper.sy));
			return _aDistance - _bDistance;
		}
		
		let b = this.mapCoords[this.activeMapCoords[idx].j];
		b.type = idx;
		// remove item before push
		var index = b.friends.indexOf(i);
		if (index !== -1) {
			b.friends.splice(index, 1);
		}

		b.friends.push(i);
		b.friends.sort(compareNumbers);

		if (b.friends.length > fcount ) {
			b.friends.pop();
		}
		//this.displayFriendsDistanceFrom(idx);
	}

	displayFriendsDistanceFrom(_i){
		let i = this.activeMapCoords[_i].j;
		console.log ("Reper from " + _i + "r_i " + i + "sx:" + this.mapCoords[i].sx + " sy:" + this.mapCoords[i].sy);

		this.mapCoords[i].friends.forEach((_idx) => {
			let idx = this.activeMapCoords[_idx].j;
			let distance = this.distance(_i,_idx);
			console.log ("Distance from " + _i + " r_i "+ i + " to " + _idx + " r_idx "+ idx + " is " + distance + " sx:" + this.mapCoords[idx].sx + " sy:" + this.mapCoords[idx].sy);
		});
	}

	distance (_i,_j){
		let i = this.activeMapCoords[_i].j;
		let j = this.activeMapCoords[_j].j;
		let distance = Math.sqrt((this.mapCoords[i].sx-this.mapCoords[j].sx)* (this.mapCoords[i].sx-this.mapCoords[j].sx) + 
			(this.mapCoords[i].sy-this.mapCoords[j].sy)* (this.mapCoords[i].sy-this.mapCoords[j].sy));
		return distance;
	}

	setFriends2(fcount) {

		let MapCoordsOrdered = [...this.mapCoords];
		//let MapCoordsOrdered = this.mapCoords.clone(); // Cloning the mapCoords array
		
		// order by sqrt(fi^2 + theta^2)
		// fi and theta should be recomputed for this to work
		let mode = this.friend_mode; 

		if (mode==0){
			MapCoordsOrdered.sort(function(a, b) {
				const aDistance = Math.sqrt(a.fi * a.fi + a.theta * a.theta);
				const bDistance = Math.sqrt(b.fi * b.fi + b.theta * b.theta);
				return aDistance - bDistance;
			});
		}

		// best
		if (mode==1){
			MapCoordsOrdered.sort(function(a, b) {
				const aDistance = Math.sqrt(
					(a.fi - b.fi) * (a.fi - b.fi) 
					+ (a.theta - b.theta) * (a.theta - b.theta)
					);
				return aDistance ;
			});
		}

		if (mode==2){
			MapCoordsOrdered.sort(function(a, b) {
				const aDistance = Math.sqrt((a.x-b.x)* (a.x-b.x) 
									+ (a.y-b.y)* (a.y-b.y));
				return aDistance ;
			});
		}

		if (mode==3){
			MapCoordsOrdered.sort(function(a, b) {
				const aDistance = Math.sqrt(a.x * a.x + a.y * a.y);
				const bDistance = Math.sqrt(b.x * b.x + b.y * b.y);
				return aDistance - bDistance;
			});
		}

		if (mode==4){
			this.shuffleArray(MapCoordsOrdered);
		}

		MapCoordsOrdered.sort().forEach((coord, index) => {
			const numPredecessors = Math.min(index, fcount);
			coord.friends = [];
			if (index%(fcount+1)==0){
				// set friends for subject
				for (let i = 0; i < numPredecessors; i++) {
					coord.friends[i] = index - (i + 1);
					coord.type = 1;
					//console.log (" index: " + index + " coord.friends[i]: " + coord.friends[i]);
				}
				//console.log(coord.friends);
				// set friends for friends

				for (let i = 0; i < numPredecessors; i++) {
					for (let j = 0; j < numPredecessors; j++) {
						//coord.friends[i] = index - (i + 1);
						if (coord.friends[i] != index){
							MapCoordsOrdered[coord.friends[i]].friends[j] = coord.friends[j];						
							MapCoordsOrdered[coord.friends[i]].type = index;
						//	console.log (" Erase index: " + index + " coord.friends[i]: " + coord.friends[i] + " coord.friends[j]: " + coord.friends[j]);							
						}else{

						}
					}
				}

			}

		});

		this.mapCoords = MapCoordsOrdered;
		
	}

	friendsSet = false;
	// we'll just update the mapCoords fi and theta
	// Need to use this before projection
	moveParticleSystemOnSphereSpace(timeBetweenCalls, fcount){
		let x,y,z;
		let dirx,diry,dirz;
		let dirx1,diry1,dirz1;
		let speed,speedx,speedy,speedz;
		let norm = 100.0;
		let tol = 10.0;
		this.setFriends(fcount,0,tol);
		this.friendsSet = true;		

		for ( var j = 0; j < this.mapCoords.length; j++ ) {		
			if (this.mapCoords[j].friends.length >= fcount){				
				let sumX = 0;
				let sumY = 0;
				for (let i = 0; i < fcount/2; i++) {
					sumX += this.mapCoords[this.mapCoords[j].friends[i]].fi;
					sumY += this.mapCoords[this.mapCoords[j].friends[i]].theta;
				}
				dirx = sumX / fcount;
				diry = sumY / fcount;
			}else{
				dirx = 0;
				diry = 0;
			}

			if (this.mapCoords[j].friends.length >= fcount){				
				let sumX = 0;
				let sumY = 0;
				for (let i = fcount/2; i < fcount; i++) {
					sumX += this.mapCoords[this.mapCoords[j].friends[i]].fi;
					sumY += this.mapCoords[this.mapCoords[j].friends[i]].theta;
				}
				dirx1 = sumX / fcount;
				diry1 = sumY / fcount;
			}else{
				dirx1 = 0;
				diry1 = 0;
			}

			x = this.mapCoords[j].fi;
			y = this.mapCoords[j].theta;

			let amp = Math.sqrt((x-dirx)*(x-dirx) + (y-diry)*(y-diry))
			if ((isNaN(amp)) || (amp == 0.0)) {
				dirx = 0.0;
				diry = 0.0;
				amp = 0.0;
			}else{			
				dirx = (x - dirx) / amp;
				diry = (y - diry) / amp;
			}

			let amp1 = Math.sqrt((x-dirx1)*(x-dirx1) + (y-diry1)*(y-diry1))
			if ((isNaN(amp1)) || (amp1 == 0.0)) {
				dirx1 = 0.0;
				diry1 = 0.0;
				amp1 = 0.0;
			}else{			
				dirx1 = (x - dirx1) / amp1;
				diry1 = (y - diry1) / amp1;
			}

			speed = this.mapCoords[j].speed;

			this.mapCoords[j].speed -= Math.sign(amp-amp1)*timeBetweenCalls/norm;

			speedx = this.mapCoords[j].directionx * speed;
			speedy = this.mapCoords[j].directiony * speed;

			//console.log("speedx: " + speedx + " speedy: " + speedy);
			this.mapCoords[j].directionx = dirx+dirx1;
			this.mapCoords[j].directiony = diry+diry1;

			x = x + speedx * timeBetweenCalls;
			y = y + speedy * timeBetweenCalls;

			//console.log("x: " + x + " y: " + y + " " + this.mapCoords[j].fi + " " + this.mapCoords[j].theta);
			this.mapCoords[j].fi = x;
			this.mapCoords[j].theta = y;
		}

	}
	// sx,sy,sz are particle effects after projection
	// spotx, spoty,s potz initial shape coordinates

	// * first movement towards spot
	// * deviation / reflection based on friends
	moveParticleSystem(timeBetweenCalls, fcount, proximity, refrien){
		this.totalelapsed += timeBetweenCalls;
		let positionAttribute;
		let right_friendAttr0;
		let right_friendAttr1;

		let sizesAttr;
		let colorAttr;
			
		if (!this.initialized) 
			return;	

		if (!this.activeInitialized)
			return;

//		if (this.friendsSet) return;

		if (refrien)
			this.setFriends(fcount,0,proximity);

		//this.setFriends(this.activeMapCoords.length,0);
		this.friendsSet = true;
		

		positionAttribute = this.particlesMap.geometry.getAttribute( 'position' );
		// need to get right_friend and size
		sizesAttr = this.particlesMap.geometry.getAttribute( 'size' );
		colorAttr = this.particlesMap.geometry.getAttribute( 'color' );	
		right_friendAttr0 = this.particlesMap.geometry.getAttribute( 'right_friend0' );
		right_friendAttr1 = this.particlesMap.geometry.getAttribute( 'right_friend1' );

		const vindex = this.particlesMap.geometry.drawRange;

		let sx,sy,sz;
		let dirx,diry,dirz;
		let dirsx,dirsy,dirsz;
		let dreflectx = 0.0;
		let dreflecty = 0.0;


		let speed,dispx, dispy;
		let norm = 100.0;

		// Debug frinds are ready so mark them properly
		//console.log("Mark debug Spot Particle");
		var debugSpot = this.mapCoords[this.activeMapCoords[this.show_friend_idx].j];
		debugSpot.type = 1001;
		debugSpot.friends.forEach ( (fidx) => {
			//console.log("findex : " + fidx + "glb idx "+ this.activeMapCoords[fidx].j +" type : " + this.mapCoords[this.activeMapCoords[fidx].j].type);
			this.mapCoords[this.activeMapCoords[fidx].j].type = 1000;
		});
		console.log(debugSpot.spotx.toFixed(2) + " (<-spx, spy->)" + debugSpot.spoty.toFixed(2));

		//console.log("Start Processing ActiveMap-------------");
		this.activeMapCoords.forEach(({ _index, kx, ky, j }) => {

			// not sure why this was added
			let tolerance = 1000;

			dreflectx = 0.0;
			dreflecty = 0.0;

			dirx = 0;
			diry = 0;
			sx = this.mapCoords[j].sx;
			sy = this.mapCoords[j].sy;

			if (this.mapCoords[j].friends.length > 0){
				let sumX = 0;
				let sumY = 0;
				let _fcount = this.mapCoords[j].friends.length;
				
				for (let i = 0; i < this.mapCoords[j].friends.length; i++) {
					sumX += this.mapCoords[this.activeMapCoords[this.mapCoords[j].friends[i]].j].sx;
					sumY += this.mapCoords[this.activeMapCoords[this.mapCoords[j].friends[i]].j].sy;	
					
					let distance = this.distance(_index,this.mapCoords[j].friends[i]);
					if (distance < tolerance){
						dreflectx += (sx - this.mapCoords[this.activeMapCoords[this.mapCoords[j].friends[i]].j].sx);
						dreflecty += (sy - this.mapCoords[this.activeMapCoords[this.mapCoords[j].friends[i]].j].sy);	
					}					
				}
				dirx = sumX / _fcount;
				diry = sumY / _fcount;
			}else{
				dirx = 0;
				diry = 0;
			}

			// dirsx is a global target spot
			dirsx = this.mapCoords[j].spotx + 0;// + 80;
			dirsy = this.mapCoords[j].spoty + 0;// + 80;

			//console.log("sx: " + sx + " sy: " + sy + " " + this.mapCoords[j].sx + " " + this.mapCoords[j].sy + " " +  " "  + this.mapCoords[j].spotx + " " + this.mapCoords[j].spoty	);

			this.mapCoords[j].favgx = dirx;
			this.mapCoords[j].favgy = diry;

			// vector to friends target
			let amp = Math.sqrt((sx-dirx)*(sx-dirx) + (sy-diry)*(sy-diry))
//			console.log("amp: " + amp + " " + sx + " " + sy + " " + dirx + " " + diry);
			//amp = 1;			

			if ((isNaN(amp)) || (amp == 0.0)) {
				dirx = 0.0;
				diry = 0.0;
				amp = 0.0;
			}else{			
				dirx = (sx - dirx) ;/// amp;		VL
				diry = (sy - diry) ;/// amp;      VL

				// OV
				//dirx = (sx - dirx) / amp;
				//diry = (sy - diry) / amp;
			}
			
			let amp1 = Math.sqrt((sx-dirsx)*(sx-dirsx) + (sy-dirsy)*(sy-dirsy))
			if ((isNaN(amp1)) || (amp1 == 0.0)) {
				dirsx = 0.0;
				dirsy = 0.0;
				amp1 = 0.0;
			}else{			
				dirsx = (sx - dirsx) ;/// amp1;
				dirsy = (sy - dirsy) ;/// amp1;
			}

//amp1 = 0;
//dirsx = 0;
//dirsy = 0;

// Temperate the imact of sport forced position
//dirsx/=10;
//dirsy/=10;
//amp = 0;

//dirx = 0.0;
//diry = 0.0;

//console.log(dirx + " " + diry + " " + amp + " " + amp1 + " " + this.mapCoords[j].speed + " " + timeBetweenCalls + " " + norm + " " + this.mapCoords[j].directionx + " " + this.mapCoords[j].directiony)	;

//this.mapCoords[j].speed = -2.1;
			//this.mapCoords[j].speed -= Math.sign(amp+amp1)*timeBetweenCalls/norm;	

			let new_speed = Math.sqrt( (dirx+dirsx)*(dirx+dirsx) + (diry+dirsy)*(diry+dirsy) ); 
			//speed = 10*this.mapCoords[j].speed*timeBetweenCalls;///new_speed;
			//onsole.log("speed: " + speed + " " + this.mapCoords[j].speed + " " + new_speed + " " + timeBetweenCalls);
			speed = this.mapCoords[j].speed;//*timeBetweenCalls;
			//console.log("Speed " + speed + " " + this.mapCoords[j].speed + " " + timeBetweenCalls);
			//speed -= Math.sin(new_speed)*0.1*Math.sign(new_speed)*timeBetweenCalls/(new_speed);
			
			
			//speed = timeBetweenCalls/(new_speed);
			//speed = -1000 * timeBetweenCalls*(new_speed);
			//new_speed = amp;
			
			speed =  -timeBetweenCalls ;/// (new_speed);  // VL

			//speed -= 0.2* timeBetweenCalls*(new_speed);
			//speed = -1000* timeBetweenCalls*(new_speed);  // this is ok

			// OV
			//speed = 400*(-1+Math.sin(this.mapCoords[j].type)/2.0)*timeBetweenCalls*(new_speed);  // this is ok

			//console.log("normd: " + normd + "dx " + dirx + "dy " + diry + "dsx " + dirsx + "dsy " + dirsy);
//			if (normd==0.0) normd = 1.0;
			
			//OV, VL
			dispx = this.mapCoords[j].directionx * speed ;
			dispy = this.mapCoords[j].directiony * speed ;					

			this.mapCoords[j].directionx = (dirx+dirsx) ;/// new_direction vector; // VL
			this.mapCoords[j].directiony = (diry+dirsy) ;/// new_direction vector;  // VL

			// OV
			//this.mapCoords[j].directionx = (dirx+dirsx) / new_speed;  
			//this.mapCoords[j].directiony = (diry+dirsy) / new_speed;  

			//console.log("Aspeedx: " + speedx + " speedy: " + speedy + " " +  speed + " dx" + this.mapCoords[j].directionx + " dy" + this.mapCoords[j].directiony	);
			
			
			sx = sx + dispx ;// VL //*Math.sin((this.totalelapsed/100.0)) + sx%30*speedx*Math.cos(sx/j%20.0)/6 ;
			sy = sy + dispy ;// VL //*Math.sin(sy/(2*j%10.0) +(this.totalelapsed/170.0)) + sy%30*speedx*Math.cos(sy/j%20.0)/6;
			
			// OV
			//sx = sx + dispx * timeBetweenCalls;
			//sy = sy + dispy * timeBetweenCalls;
			
			sz = positionAttribute.getZ(_index);

			positionAttribute.setXYZ(_index, sx, sy, sz);
			this.mapCoords[j].speed = speed;

			// this is actually useles
			this.mapCoords[j].sx = sx;
			this.mapCoords[j].sy = sy;
			this.mapCoords[j].sz = sz;

			// debug coloring	- very ugly		
			if (this.mapCoords[j].type == 1000){
				colorAttr.setXYZ( _index,  1.0, 0.1, 0.1  );
			}else{

				if (this.mapCoords[j].type == 1001){
					colorAttr.setXYZ( _index,  1.0, 1.0, 1.0  );
				}else{
					//this.color.setHSL(this.mapCoords[j].type/this.activeMapCoords.length, 0.7 , 0.7 );
					//colorAttr.setXYZ( _index,  this.color.r, this.color.g, this.color.b  );
					var a = this.mapCoords[j];	
					colorAttr.setXYZ( _index,  0.1, 0.1, 0.9  );
				}
			//colorAttr.setXYZ( _index,  this.color.r, this.color.g, this.color.b  );
			}
			
			//console.log(_index +" " + this.totalelapsed + " " );

			// fragment part			
			//colorAttr.setXYZ( _index,  this.color.r, this.color.g, this.color.b  );
			right_friendAttr0.setXYZ( _index, this.rfcolor.r,kx, ky );
			right_friendAttr1.setXYZ( _index, 4*Math.sin(sx*Math.PI/this.prjMapData.square_size_x)/20.0,4*Math.cos(Math.PI*sy*0.5/this.prjMapData.square_size_y)/12.0, 0 );

		});

		//console.log("END -------------");
		positionAttribute.needsUpdate = true;
		
		sizesAttr.needsUpdate = true;
		colorAttr.needsUpdate = true;
		right_friendAttr0.needsUpdate = true;
		right_friendAttr1.needsUpdate = true;
	}

	delaunyInitialized = false;

	delaunatorMap(){
			// Delauny triangulation
			// triangulate x, z
			if (!this.initialized) return;

			const pointsMapArray = this.particlesMap.geometry.getAttribute('position').array;

			//const pointsMap = this.pointsMap;	
			if (pointsMapArray.length < 3) return;

			const pointsMap = [];			
			for (let i = 0; i < this.maxvindex*3; i += 3) {
				const x = pointsMapArray[i];
				const y = pointsMapArray[i + 1];
				const z = pointsMapArray[i + 2];
				pointsMap.push(new THREE.Vector3(x, y, z));
			}

			var indexDelaunay = Delaunator.from(
				pointsMap.map((v, i) => {
				return [v.x, v.y];
				})
			);			

			if (!this.delaunyInitialized) {
				const geometryMap = new THREE.BufferGeometry().setFromPoints( pointsMap );

				const colorAttr = this.particlesMap.geometry.getAttribute( 'color' );	

				const right_friendAttr0 = this.particlesMap.geometry.getAttribute( 'right_friend0' );
				const right_friendAttr1 = this.particlesMap.geometry.getAttribute( 'right_friend1' );
				const right_friendAttr2 = this.particlesMap.geometry.getAttribute( 'right_friend2' );
				const right_friendAttr3 = this.particlesMap.geometry.getAttribute( 'right_friend3' );
				const right_friendAttr4 = this.particlesMap.geometry.getAttribute( 'right_friend4' );	

				geometryMap.setAttribute( 'color', colorAttr );
				geometryMap.setAttribute( 'right_friend0', right_friendAttr0 );
				geometryMap.setAttribute( 'right_friend1', right_friendAttr1 );
				geometryMap.setAttribute( 'right_friend2', right_friendAttr2 );
				geometryMap.setAttribute( 'right_friend3', right_friendAttr3 );
				geometryMap.setAttribute( 'right_friend4', right_friendAttr4 );
							
				console.log("pointsMap " + pointsMap.length);
												
				var meshIndex = []; 
				for (let i = 0; i < indexDelaunay.triangles.length; i++){
					meshIndex.push(indexDelaunay.triangles[i]);	
					//console.log("BIN "+ indexDelaunay.triangles[i]);
				}

				geometryMap.setIndex(meshIndex); // add three.js index to the existing geometry
				geometryMap.computeVertexNormals();
					
				this.scene.remove(this.delaunyMap);

				this.delaunyMap = new THREE.Mesh(
					geometryMap, // re-use the existing geometry
					this.shaderMaterialSurface,
				);
				
				
				if (!this.hide_delaunay)			
					this.scene.add(this.delaunyMap);

				this.delaunyMap.position.z = 260;
				console.log("delaunyMap Reinitialized " + this.delaunyMap.geometry.index.count);

				this.delaunyInitialized = true;
			}else{
				// update the delaunyMap
				const positions = this.delaunyMap.geometry.getAttribute('position');
				const colorAttr = this.delaunyMap.geometry.getAttribute( 'color' );
				const right_friendAttr0 = this.delaunyMap.geometry.getAttribute( 'right_friend0' );
				const right_friendAttr1 = this.delaunyMap.geometry.getAttribute( 'right_friend1' );
				const right_friendAttr2 = this.delaunyMap.geometry.getAttribute( 'right_friend2' );
				const right_friendAttr3 = this.delaunyMap.geometry.getAttribute( 'right_friend3' );
				const right_friendAttr4 = this.delaunyMap.geometry.getAttribute( 'right_friend4' );
				
				//console.log("indexDelaunay.triangles " + pointsMapArray.length/3 + " " + indexDelaunay.triangles.length);

				for (let i = 0; i < this.maxvindex*3; i += 3) {
					let vindex = i / 3;
					this.color.setHSL( vindex / this.maxvindex, 0.5, 0.8 );
					positions.setXYZ(vindex, pointsMapArray[i], pointsMapArray[i + 1], pointsMapArray[i + 2]);
//					colorAttr.setXYZ( vindex,  this.color.r, this.color.g, this.color.b  );
//					right_friendAttr0.setXYZ( vindex, 0, 0, 0 );
//					right_friendAttr1.setXYZ( vindex, 0, 0, 0 );
//					right_friendAttr2.setXYZ( vindex, 0, 0, 0 );
//					right_friendAttr3.setXYZ( vindex, 0, 0, 0 );
//					right_friendAttr4.setXYZ( vindex, 0, 0, 0 );
				}

				// Get the index attribute
				const indices = this.delaunyMap.geometry.getIndex();

				// Update the indices
				for (let i = 0; i < indexDelaunay.triangles.length; i++) {
					indices.setX(i, indexDelaunay.triangles[i]);
				}

				this.delaunyMap.geometry.setDrawRange( 0, indexDelaunay.triangles.length )				
				indices.needsUpdate = true;
				positions.needsUpdate = true;
//				right_friendAttr0.needsUpdate = true;
//				right_friendAttr1.needsUpdate = true;
//				right_friendAttr2.needsUpdate = true;
//				right_friendAttr3.needsUpdate = true;
//				right_friendAttr4.needsUpdate = true;
				colorAttr.needsUpdate = true;				
			}

	}

	// This generates the wold map
	// x,y number of squares
	generateProjectionMap(regen_){									
		let positionAttribute;
		let right_friendAttr0;
		let right_friendAttr1;

		let sizesAttr;
		let colorAttr;
		let regen = regen_;

		if (!regen){			
			positionAttribute = this.particlesMap.geometry.getAttribute( 'position' );
			// need to get right_friend and size
			right_friendAttr0 = this.particlesMap.geometry.getAttribute( 'right_friend0' );
			right_friendAttr1 = this.particlesMap.geometry.getAttribute( 'right_friend1' );

			sizesAttr = this.particlesMap.geometry.getAttribute( 'size' );
			colorAttr = this.particlesMap.geometry.getAttribute( 'color' );			
		}

		this.right_friend0 = [];
		this.right_friend1 = [];
		this.right_friend2 = [];
		this.right_friend3 = [];
		this.right_friend4 = [];

		this.colors = [];
		this.sizes = [];
		this.pointsMap = [];
		this.activeMapCoords = [];	

		let vindex = 0;		
		
		const vec_origin = new THREE.Vector3(0, 0, 0);

		for (var n = 0;n<this.square_list.length;n++){
			// there are 5 points per square
			const positionAttributeSquare = this.square_flat_list[n].geometry.getAttribute( 'position' );
			const positionAttributeSquareSurface = this.square_flat_surface_list[n].geometry.getAttribute( 'position' );

			const planePoints = [];
			for (let i = 0; i < 5; i++) {
				const x = positionAttributeSquare.getX(i);
				const y = positionAttributeSquare.getY(i);
				const z = positionAttributeSquare.getZ(i);
				planePoints.push(new THREE.Vector3(x, y, z));					
			}

			const plane = new THREE.Plane().setFromCoplanarPoints(planePoints[0], planePoints[1], planePoints[2]);
			const horizontalPlaneNormal = new THREE.Vector3(0, 0, 1);
			const quaternion = new THREE.Quaternion().setFromUnitVectors(horizontalPlaneNormal, plane.normal);
			let q_inverse = quaternion.invert();
							
			// computing the angle in plane of the square
			// compute the angle in plane of the square
			let point0 = new THREE.Vector3(planePoints[0].x, planePoints[0].y, planePoints[0].z);
			let point1 = new THREE.Vector3(planePoints[1].x, planePoints[1].y, planePoints[1].z);
			let point2 = new THREE.Vector3(planePoints[2].x, planePoints[2].y, planePoints[2].z);
			
			this.square_surface_list[n].worldToLocal(point0);
			point0.applyQuaternion(q_inverse); // Apply quaternion to each point

			this.square_surface_list[n].worldToLocal(point1);
			point1.applyQuaternion(q_inverse); // Apply quaternion to each point

			this.square_surface_list[n].worldToLocal(point2);
			point2.applyQuaternion(q_inverse); // Apply quaternion to each point

			let angle = Math.atan2(point2.x - point1.x, point2.y - point1.y);

			let ky = this.defIndexh + Math.floor(n/this.prjMapData.y);
			let kx = this.defIndexv + n%this.prjMapData.y;
			
			const centerX = (point0.x + point2.x) / 2;
			const centerY = (point0.y + point2.y) / 2;

			for (let i = 0; i < 5; i++) {
				const x = positionAttributeSquare.getX(i);
				const y = positionAttributeSquare.getY(i);
				const z = positionAttributeSquare.getZ(i);
				let point = new THREE.Vector3(x, y, z);
				this.square_surface_list[n].worldToLocal(point);						
				point.applyQuaternion(q_inverse); // Apply quaternion to each point to make it horizontal

				// Rotate the points around the center of the square to make it horizontal
				const rotatedX = (point.x - centerX) * Math.cos(angle) - (point.y - centerY) * Math.sin(angle) + centerX;
				const rotatedY = (point.x - centerX) * Math.sin(angle) + (point.y - centerY) * Math.cos(angle) + centerY;

				if (this.rotate_squares){
					point.x = rotatedX ;
					point.y = rotatedY ;
				}

				// Move it on display
				const fpoint = this.toScreenPosition(point, kx, ky);
				const fpoint_surf = this.toScreenPosition(point, kx, ky);

				positionAttributeSquare.setXYZ(i, fpoint.x, fpoint.y, fpoint.z);
				positionAttributeSquareSurface.setXYZ(i, fpoint_surf.x, fpoint_surf.y, fpoint_surf.z);
				
			}

			positionAttributeSquare.needsUpdate = true;
			positionAttributeSquareSurface.needsUpdate = true;
			
			for ( var j = 0; j < this.mapCoords.length; j++ ) {					

				var _x = this.mapCoords[j].x;
				var _y = this.mapCoords[j].y;
				var _z = this.mapCoords[j].z;

				const vec2 = new THREE.Vector3(_x,_y,_z);

				// go for the intersection
				let raycaster = new THREE.Raycaster();

				let point1 = new THREE.Vector3(vec_origin.x, vec_origin.y, vec_origin.z);
				let point2 = new THREE.Vector3(vec2.x, vec2.y, vec2.z);
				
				let direction = new THREE.Vector3().subVectors(point2, point1).normalize();
				raycaster.set(point1, direction);

				let intersects = raycaster.intersectObject(this.square_surface_list[n]);

				this.mapCoords[j].directionx = 0.0;
				this.mapCoords[j].directiony = 0.0;
				this.mapCoords[j].directionz = 0.0;

				if ((intersects.length <= 0) && (this.mapCoords[j].mode == 0)){

				} else {
					let vdest;
					if (this.mapCoords[j].mode == 0) {
						let intersectionPoint = intersects[0].point;
						
						this.square_surface_list[n].worldToLocal(intersectionPoint);
						intersectionPoint.applyQuaternion(q_inverse);

						const vec1 = new THREE.Vector3();
						vec1.x = intersectionPoint.x;
						vec1.y = intersectionPoint.y;
						vec1.z = intersectionPoint.z;					
								
						let point = vec1;
						// Rotate the points around the center of the square to make it horizontal
						const rotatedX = (point.x - centerX) * Math.cos(angle) - (point.y - centerY) * Math.sin(angle) + centerX;
						const rotatedY = (point.x - centerX) * Math.sin(angle) + (point.y - centerY) * Math.cos(angle) + centerY;

						if (this.rotate_squares){
							point.x = rotatedX ;
							point.y = rotatedY ;
						}
					
						vdest = this.toScreenPosition(point, kx, ky);
					}else{
					// if it a flat map point go for direct coordinates
					// to do : obsolete all calculations for projection
					//if (this.mapCoords[j].mode == 1)
						vdest = new THREE.Vector3(this.mapCoords[j].x,this.mapCoords[j].y,-100); 
					}

					// final data for particle system after projection
					this.mapCoords[j].spotx = vdest.x;
					this.mapCoords[j].spoty = vdest.y;
					this.mapCoords[j].spotz = vdest.z;
					this.mapCoords[j].sx = vdest.x;
					this.mapCoords[j].sy = vdest.y;
					this.mapCoords[j].sz = vdest.z;

					this.rfcolor = this.color;
					this.color.setHSL( vindex / this.maxvindex, 1.0, 0.5 );
					//this.color.setHSL( 0.4, 1.0, 0.5 );
				
					if (!regen){											
						positionAttribute.setXYZ( vindex, vdest.x, vdest.y, vdest.z);						

						//if (kx%this.prjMapData.x == 2 && ky%this.prjMapData.y == 2){
						if ((kx > 0 && kx<this.prjMapData.y - 1) && (ky > 0 && ky<this.prjMapData.x - 1)){
							colorAttr.setXYZ( vindex,  this.color.r, this.color.g, this.color.b  );
							//colorAttr.setXYZ( vindex,  0.9, 0.1, 0.1  );
							right_friendAttr0.setXYZ( vindex, this.rfcolor.r,kx, ky );
							right_friendAttr1.setXYZ( vindex, Math.sin(vdest.x*Math.PI/this.prjMapData.square_size_x)*0.4,Math.cos(Math.PI*vdest.y*0.5/this.prjMapData.square_size_y), 0 );

						}else{
							colorAttr.setXYZ( vindex,  0.1, 0.1, 0.9  );
							right_friendAttr0.setXYZ( vindex, this.rfcolor.r,kx, ky );
							right_friendAttr1.setXYZ( vindex, Math.sin(vdest.x*Math.PI/this.prjMapData.square_size_x)*0.4,Math.cos(Math.PI*vdest.y*0.5/this.prjMapData.square_size_y), 0 );

						}

						let vcolor = 40;
						let x = (vindex+n)%(2*vcolor);
						if (x>vcolor) x = (vcolor - x%vcolor);											

						sizesAttr.setXYZ( vindex, x);

						if (vindex > positionAttribute.count){
							console.log("vindex > positionAttribute.count");
							return false;
						}

					}else{
						this.right_friend0.push( this.rfcolor.r,kx, ky );
						this.right_friend1.push( Math.sin(vdest.x*Math.PI/this.prjMapData.square_size_x)*0.4,Math.cos(Math.PI*vdest.y*0.5/this.prjMapData.square_size_y), 0 );
						this.right_friend2.push( this.rfcolor.r,kx, ky );
						this.right_friend3.push( this.rfcolor.r,kx, ky );
						this.right_friend4.push( this.rfcolor.r,kx, ky );

						this.colors.push( 0.9, 0.1, 0.1 );	
						let vcolor = 20;
						let x = (vindex+n)%(2*vcolor);
						if (x>vcolor) x = (vcolor - x%vcolor);						

						this.sizes.push( x);

						this.pointsMap.push (vdest);		
					} 

					this.activeMapCoords.push ({_index:vindex,kx:kx,ky:ky,j:j});
					vindex++;
				}
			}
		}		

		

		if (regen){			
			this.geometryMap.setFromPoints( this.pointsMap );
			this.geometryMap.setAttribute( 'color', new THREE.Float32BufferAttribute( this.colors, 3 ) );

			this.geometryMap.setAttribute( 'right_friend0', new THREE.Float32BufferAttribute( this.right_friend0, 3 ).setUsage( THREE.DynamicDrawUsage ) );
			this.geometryMap.setAttribute( 'right_friend1', new THREE.Float32BufferAttribute( this.right_friend1, 3 ).setUsage( THREE.DynamicDrawUsage ) );
			this.geometryMap.setAttribute( 'right_friend2', new THREE.Float32BufferAttribute( this.right_friend2, 3 ).setUsage( THREE.DynamicDrawUsage ) );
			this.geometryMap.setAttribute( 'right_friend3', new THREE.Float32BufferAttribute( this.right_friend3, 3 ).setUsage( THREE.DynamicDrawUsage ) );
			this.geometryMap.setAttribute( 'right_friend4', new THREE.Float32BufferAttribute( this.right_friend4, 3 ).setUsage( THREE.DynamicDrawUsage ) );

			this.geometryMap.setAttribute( 'size', new THREE.Float32BufferAttribute( this.sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );
			console.log("vindex " + vindex + "out of " + this.geometryMap.attributes.position.count);
			this.maxvindex = vindex;
			this.activeInitialized = true;
			this.delaunyInitialized = false;

		}else{		
			this.particlesMap.geometry.setDrawRange( 0, vindex )
			this.maxvindex = vindex;
			// update
			//console.log("vindex update" + vindex + "out of " + this.geometryMap.attributes.position.count);

			positionAttribute.needsUpdate = true;
			colorAttr.needsUpdate = true;
			sizesAttr.needsUpdate = true;

			right_friendAttr0.needsUpdate = true; 
			right_friendAttr1.needsUpdate = true; 
			//right_friendAttr2.needsUpdate = true; 
			//right_friendAttr3.needsUpdate = true; 
			//right_friendAttr4.needsUpdate = true; 
			//this.particlesMap.geometry.computeBoundingBox();
			//this.particlesMap.geometry.computeBoundingSphere();
			//console.log("vindex Update" + vindex + "out of " + this.particlesMap.geometry.attributes.position.count);
			return true;
		}

		
		
		//return new THREE.Points( this.geometryMap, new THREE.PointsMaterial( { color: 0xAAEEFF } ) );
		return new THREE.Points( this.geometryMap, this.shaderMaterial );
	}

	// Function to check if a point is inside a polygon
	isPointInsidePolygon(point, polygonPoints) {
		const polygon = new THREE.Polygon(polygonPoints);
		return polygon.containsPoint(point);
	}
	
	vecOnSphereRotate(x,y,z,hstep, vstep, i, j){						
		var vec;
		var quaternion = new THREE.Quaternion();

		vec = new THREE.Vector3(x,y,z);

		// get the main shape
		quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), j*vstep - this.prjMapData.y*vstep/2.0 + vstep/2.0);
		vec.applyQuaternion( quaternion );

		quaternion.setFromAxisAngle( new THREE.Vector3( -1, 0, 0 ), i*hstep - this.prjMapData.x*hstep/2.0 + hstep/2.0 );		
		vec.applyQuaternion( quaternion );							

		// rotate the shape	
		quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), this.defIndextheta);				
		vec.applyQuaternion( quaternion );
	
		quaternion.setFromAxisAngle( new THREE.Vector3( -1, 0, 0 ), this.defIndexfi);		
		vec.applyQuaternion( quaternion );							

		return vec;
	}

	updateWindows(){			
		var i,j;
		var x,y,z;
		var vec;	

		const vstep = this.prjMapData.vstep;
		const hstep = this.prjMapData.hstep;
		const R = this.R;
		
		for (var n = 0;n<this.square_list.length;n++){

			i = Math.floor(n/this.prjMapData.y);
			j = n%this.prjMapData.y;
			
			const positionAttribute = this.square_list[n].geometry.getAttribute( 'position' );

			// 5 points for wach square window
			for ( let m = 0; m < positionAttribute.count/5; m++ ) {						
				x = -this.prjMapData.window_w/2 ; y = this.prjMapData.window_h/2 ; z = Math.sqrt(R*R - x*x - y*y);			
				vec = this.vecOnSphereRotate(x,y,z,hstep,vstep,i,j);
				positionAttribute.setXYZ(m, vec.x,vec.y,vec.z);
				//console.log(vec);
				
				x = this.prjMapData.window_w/2 ; y = this.prjMapData.window_h/2 ; z = Math.sqrt(R*R - x*x - y*y);
				vec = this.vecOnSphereRotate(x,y,z,hstep,vstep,i,j);
				positionAttribute.setXYZ(m+1, vec.x,vec.y,vec.z);

				x = this.prjMapData.window_w/2 ; y = -this.prjMapData.window_h/2 ; z = Math.sqrt(R*R - x*x - y*y);						
				vec = this.vecOnSphereRotate(x,y,z,hstep,vstep,i,j);
				positionAttribute.setXYZ(m+2, vec.x,vec.y,vec.z);

				x = -this.prjMapData.window_w/2 ; y = -this.prjMapData.window_h/2 ; z = Math.sqrt(R*R - x*x - y*y);						
				vec = this.vecOnSphereRotate(x,y,z,hstep,vstep,i,j);
				positionAttribute.setXYZ(m+3, vec.x,vec.y,vec.z);
				
				x = -this.prjMapData.window_w/2 ; y = this.prjMapData.window_h/2 ; z = Math.sqrt(R*R - x*x - y*y);
				vec = this.vecOnSphereRotate(x,y,z,hstep,vstep,i,j);
				positionAttribute.setXYZ(m+4, vec.x,vec.y,vec.z);		
				
				positionAttribute.needsUpdate = true; 						
			}
		}				
	}



	generateSquare(i,j,vstep,hstep, definndexh, defindexv){		
						
		const points = [];
		const geometry = new THREE.BufferGeometry();
		

		var x,y,z;				
		var vec;
		var R = this.R;

		x = -this.prjMapData.window_w/2 ; y = this.prjMapData.window_h/2 ; z = Math.sqrt(R*R - x*x - y*y);			
		vec = this.vecOnSphereRotate(x,y,z,hstep,vstep,i,j);
		points.push (vec);

		x = this.prjMapData.window_w/2 ; y = this.prjMapData.window_h/2 ; z = Math.sqrt(R*R - x*x - y*y);
		vec = this.vecOnSphereRotate(x,y,z,hstep,vstep,i,j);	
		points.push (vec);

		x = this.prjMapData.window_w/2 ; y = -this.prjMapData.window_h/2 ; z = Math.sqrt(R*R - x*x - y*y);
		vec = this.vecOnSphereRotate(x,y,z,hstep,vstep,i,j);
		points.push (vec);

		x = -this.prjMapData.window_w/2 ; y = -this.prjMapData.window_h/2 ; z = Math.sqrt(R*R - x*x - y*y);
		vec = this.vecOnSphereRotate(x,y,z,hstep,vstep,i,j);
		points.push (vec);

		x = -this.prjMapData.window_w/2 ; y = this.prjMapData.window_h/2 ; z = Math.sqrt(R*R - x*x - y*y);
		vec = this.vecOnSphereRotate(x,y,z,hstep,vstep,i,j);
		points.push (vec);

		geometry.setFromPoints( points );
		

		const material = new THREE.LineBasicMaterial( { color: 0xff2222 } );										
		const line = new THREE.Line( geometry, material );	
		const line_flat = new THREE.Line( geometry.clone(), material );	


		let geometry_surface = new THREE.BufferGeometry();
		let geometry_flat_surface = new THREE.BufferGeometry();

		let vertices = [];
		let indices = [];
		let indices_canvas = [];
		let uv = [];

		let vertices_flat_surface = [];
		// Add the points as vertices
		for (let i = 0; i < points.length - 1; i++) {
			vertices.push(points[i].x, points[i].y, points[i].z);
			vertices_flat_surface.push(points[i].x, points[i].y, points[i].z);
		}
		uv.push(1,1); uv.push(1,-1); uv.push(0,1); uv.push(0,-1);
		// Define the vertices that make up each of the two triangles
		indices.push(0, 1, 2); // First triangle
		indices.push(0, 2, 3); // Second triangle
		
		indices_canvas.push(0, 2, 1); // First triangle
		indices_canvas.push(0, 3, 2); // Second triangle

		geometry_surface.setIndex(indices);
		geometry_surface.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

		geometry_flat_surface.setIndex(indices_canvas);
		geometry_flat_surface.setAttribute('position', new THREE.Float32BufferAttribute(vertices_flat_surface, 3));
		geometry_flat_surface.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
		
		let material_surface = new THREE.MeshBasicMaterial({ color: 0xffaaff, side: THREE.DoubleSide });
		let material_flat_surface = new THREE.MeshBasicMaterial({ color: 0x111822, side: THREE.FrontSide });
	
		let mesh = new THREE.Mesh(geometry_surface, material_surface);
		
		// mesh and mesh_flat_surface are equal but they need to be cloned
		//let mesh_flat_surface = new THREE.Mesh(geometry_flat_surface, material_flat_surface);

		let mesh_flat_surface = new THREE.Mesh(geometry_flat_surface, this.shaderMaterialCanvas);

		this.square_list.push(line);
		this.square_flat_list.push(line_flat);
		this.square_surface_list.push(mesh);
		this.square_flat_surface_list.push(mesh_flat_surface);
	}

	// build the squeares for wach window to be projected on the sphere
	generateWindows(){
		let square_group = new THREE.Group();
		
		const vstep = this.prjMapData.vstep;
		const hstep = this.prjMapData.hstep;

		for (var i = 0;i < this.prjMapData.x; i++){
			for (var j = 0;j < this.prjMapData.y; j++){
				this.generateSquare(i + this.defIndexh, j + this.defIndexv ,vstep,hstep );
			}
		}		

		// build the geometry of the squares
		for (var n = 0;n<this.square_list.length;n++){								
			square_group.add(this.square_list[n]);

			this.square_surface_group.add(this.square_surface_list[n]);	

			this.square_flat_group.add(this.square_flat_list[n]);		
			this.square_flat_surface_group.add(this.square_flat_surface_list[n]);					
			
		}

		this.square_flat_group.position.z = 250;
		this.square_flat_surface_group.position.z = 300;
		return square_group;
	}
	

	loadRandomMapFlat(){
		// add another 1000 particles on the sphere
		for ( let i = 0; i < 100; i ++ ) {					
			var fi = THREE.MathUtils.randFloatSpread( Math.PI);
			var theta = THREE.MathUtils.randFloatSpread( 2*Math.PI );

			this.mapCoords.push(new MapCoord(fi,theta));								
		}				
	}


	loadRandomMap(){
		// add another 1000 particles on the sphere
		for ( let i = 0; i < 50; i ++ ) {					
			//var fi = THREE.MathUtils.randFloatSpread( Math.PI );
			var fi = (i%20)*Math.PI/10.0 ;
			//var theta = THREE.MathUtils.randFloatSpread( 2*Math.PI/3 * (i%3) );
			var theta =  2*Math.PI/8;

			this.mapCoords.push(new MapCoord(fi,theta, this.R));								
		}				
	}

	loadFromRaw(){
		for (let i = 0; i < this.mapCoordsRaw.length;i++ ){
			this.mapCoords.push( new MapCoord( Math.PI - 
				this.mapCoordsRaw[i][0]*(2*Math.PI)/180, -this.mapCoordsRaw[i][1]*2*Math.PI/180, this.R));
			//console.log(mapCoordsRaw[i]);
		}

		for (let i = 0; i < this.mapCoordsRaw1.length;i++ ){
			this.mapCoords.push( new MapCoord( Math.PI - this.mapCoordsRaw1[i][0]*(2*Math.PI)/180, -this.mapCoordsRaw1[i][1]*2*Math.PI/180, this.R));
			//console.log(mapCoordsRaw1[i]);
		}
	}

	resetAuxDataMap(){
	
	}

	updateMapCoords(){
		for (let i=0;i<this.mapCoords.length;i++){
			this.mapCoords[i].fi = (i%80)*Math.PI/40.0;
			this.mapCoords[i].theta = (i%800)*Math.PI/400.0 + Math.PI/2.0;
			
			this.mapCoords[i].x = this.R * Math.cos(this.mapCoords[i].theta) * Math.cos(this.mapCoords[i].fi);
			this.mapCoords[i].y = this.R * Math.cos(this.mapCoords[i].theta) * Math.sin(this.mapCoords[i].fi);
			this.mapCoords[i].z = this.R * Math.sin(this.mapCoords[i].theta);

			//this.mapCoords[i].speed = Math.sin((this.fi+this.theta)/2.0)/4.0;
			//this.mapCoords[i].directionx = 0.0;
			//this.mapCoords[i].directiony = 0.0;
			//this.mapCoords[i].directionz = 0.0;
		}

		this.rebuildMapData();
	}

	generateMap(){
		this.radius_group = new THREE.Group();
		const geometry = new THREE.BufferGeometry();						
		const vertices = [];
		const vec_origin = new THREE.Vector3(0, 0, 0);
		let points = [];
		

		for ( var j = 0; j < this.mapCoords.length; j++ ) {	
			var x = this.mapCoords[j].x;
			var y = this.mapCoords[j].y;
			var z = this.mapCoords[j].z;

			const vec = new THREE.Vector3(x,y,z);		

			vertices.push(vec.x); // x
			vertices.push(vec.y); // y
			vertices.push(vec.z); // z	

			// radius line
			const geometry_line = new THREE.BufferGeometry();		
			points = [];
			points.push (vec);
			points.push (vec_origin);
			geometry_line.setFromPoints( points );				
			const line = new THREE.Line( geometry_line, new THREE.LineBasicMaterial( { color: 0x00ffff } ) );
			this.radius_group.add(line);			
		}

		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
		return new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x008888 } ) );				
	}

	generateFriendsLines(){		
		const z = 160;
		const points1 = [];		
		const geometry_line1 = new THREE.BufferGeometry();

		// Enumerate lines in friends_group
		this.friends_group.children.forEach((line) => {
			line.geometry.dispose(); // Free the buffer of the line
			this.friends_group.remove(line);
		});

		
		this.activeMapCoords.forEach((item, i) => {
			if ( i == this.show_friend_idx ){
			//if ( i < 10000 ){

			const geometry_line = new THREE.BufferGeometry();

			const points = [];
			

			const real_j = item.j;
			const real_x = this.mapCoords[real_j].sx;
			const real_y = this.mapCoords[real_j].sy;
			const real_z = this.mapCoords[real_j].sz;
			const orig = this.mapCoords[real_j];

			const origin_vec = new THREE.Vector3(real_x,real_y,z);		
			
			this.mapCoords[real_j].friends.forEach((_friendaindex, k) => {				
				points.push (origin_vec);
				const real_friend = this.mapCoords[this.activeMapCoords[_friendaindex].j];
				const friend_vec = new THREE.Vector3(real_friend.sx,real_friend.sy,z);
				points.push (friend_vec);		
			});

			geometry_line.setFromPoints( points );

			const line = new THREE.Line( geometry_line, new THREE.LineBasicMaterial( { color: 0xffff00 } ) );
			this.friends_group.add(line);			

			// line between sx and favgx
			const favg_vec = new THREE.Vector3(orig.favgx,orig.favgy,z);
			points1.push (origin_vec);
			points1.push (favg_vec);
		}
	
		});

		geometry_line1.setFromPoints( points1 );

		const line1 = new THREE.Line( geometry_line1, new THREE.LineBasicMaterial( { color: 0x4499ff } ) );
		this.friends_group.add(line1);
	}

	// fi , theta, coords /in lat and longitude
	// index id
	// hmid, vmid - map sqluare pos	
	ReGenerateMap(regen){
		const hide_sphere = false;
		if (regen){

			if (!hide_sphere)
				this.regenerateSphereMap();

			this.regeneratemap(regen);					

		} else {

			if (!hide_sphere)
				this.regenerateSphereMap(true);

			if (!this.regeneratemap(regen)){				
				console.log("Force regen Map");
				this.ReGenerateMap(true);
			}
		}				

	}

	
}

export { LbMap }



