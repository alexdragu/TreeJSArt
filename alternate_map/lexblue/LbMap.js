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

class MapCoord {
	constructor(fi, theta, x, y, z){
		this.fi = fi;
		this.theta = theta;

		this.x = x;
		this.y = y;
		this.z = z;

		this.friends = [];

		// need an autoincrement here
		this.id = ProjectionMapData.indexCounter++;
			

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
	radius_group;
	square_list = [];
	square_flat_list = [];	
	square_surface_list = [];
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

	parsePolygonCoords(polygonString) {
		// Remove the "POLYGON " prefix and split the string into polygons
		const polygons = polygonString.slice(8).split('), (');
		// Map each polygon string to an array of MapCoords objects
		const mapCoordsArrays = polygons.map(polygonString => {
			// Remove the leading and trailing parentheses
			const coordsString = polygonString.slice(2, -2);
			// Split the coordinates string into an array of strings
			const coordsArray = coordsString.split(',');
			// Map each string to a MapCoords object
			return coordsArray.map(coordString => {
				const [x, y] = coordString.trim().split(' ').map(Number);
				//return new MapCoord( x*(Math.PI)/180.0, y*(Math.PI)/(180.0));
				return new MapCoord( x*(Math.PI)/180.0, y*(Math.PI)/(180.0));
				//return new MapCoord( 0.0 * Math.PI/180 +x*(Math.PI)/180.0, y*(Math.PI)/(90.0));
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
		
		this.factory();		

		this.square_surface_group = new THREE.Group();
		this.square_flat_group = new THREE.Group();
		
	}

	initMapData(mapdata) {		
		const arrayOfMaps = [];
		const newMapCoords = this.parsePolygonCoords(mapdata).flat();
		//this.mapCoords = newMapCoords;

		this.mapCoords = this.mapCoords.concat(newMapCoords);
	
		this.rebuildMapData();
	}

	rebuildMapData(mapdata) {
		this.object.remove(this.particles);
		this.object.remove(this.square_group);
		this.scene.remove(this.radius_group);

		this.particles = this.generateMap();
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
			
			this.square_group.remove(this.square_list[n]);						
			this.square_surface_group.remove(this.square_surface_list[n]);						
			this.square_flat_group.remove(this.square_flat_list[n]);
		}


		this.square_list = [];
		this.square_surface_list = [];
		this.square_flat_list = [];

		this.object.remove(this.square_group);
		this.square_group = this.generateWindows();

		this.object.add(this.square_group);	
		//this.scene.add(this.square_surface_group);
		this.scene.add(this.square_flat_group);
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

	
	setFriends() {

		let MapCoordsOrdered = this.mapCoords.slice(); // Cloning the mapCoords array
		
		// order by sqrt(fi^2 + theta^2)
		MapCoordsOrdered.sort(function(a, b) {
			const aDistance = Math.sqrt(a.fi * a.fi + a.theta * a.theta);
			const bDistance = Math.sqrt(b.fi * b.fi + b.theta * b.theta);
			return aDistance - bDistance;
		});

		MapCoordsOrdered.forEach((coord, index) => {
			const numPredecessors = Math.min(index, 3);
			coord.friends = [];
			for (let i = 0; i < numPredecessors; i++) {
				coord.friends[i] = index - (i + 1);
			}
		});

		this.mapCoords = MapCoordsOrdered;
		
	}

	moveParticleSystem(timeBetweenCalls){
		let positionAttribute;
		let right_friendAttr0;
		let right_friendAttr1;
		let right_friendAttr2;
		let right_friendAttr3;
		let right_friendAttr4;
		let sizesAttr;
		let colorAttr;
			
		if (!this.initialized) 
			return;	

		if (!this.activeInitialized)
			return;

		this.setFriends();

		//positionAttribute = this.particlesMap.geometry.getAttribute( 'position' );
		// need to get right_friend and size
		right_friendAttr0 = this.particlesMap.geometry.getAttribute( 'right_friend0' );
		right_friendAttr1 = this.particlesMap.geometry.getAttribute( 'right_friend1' );
		right_friendAttr2 = this.particlesMap.geometry.getAttribute( 'right_friend2' );
		right_friendAttr3 = this.particlesMap.geometry.getAttribute( 'right_friend3' );
		right_friendAttr4 = this.particlesMap.geometry.getAttribute( 'right_friend4' );

		sizesAttr = this.particlesMap.geometry.getAttribute( 'size' );
		colorAttr = this.particlesMap.geometry.getAttribute( 'color' );		
		
		const vindex = this.particlesMap.geometry.drawRange;

		console.log("LEN :" + this.activeMapCoords.length);
		/*
		for (let i = 0;i <this.activeMapCoords.length;i++){
			console.log(this.activeMapCoords);
		}
		*/
		this.activeMapCoords.forEach(({ _index, kx, ky, j }) => {
		//	console.log("vindex " + _index + " kx " + kx + " ky " + ky + " j " + j);
		//	console.log("LEN :" + this.activeMapCoords.length);
		//	console.log(this.mapCoords[j]);

			if (this.mapCoords[j].friends.length >=3){
				right_friendAttr2.setXYZ(_index,this.mapCoords[this.mapCoords[j].friends[0]].x, this.mapCoords[this.mapCoords[j].friends[0]].y, this.mapCoords[this.mapCoords[j].friends[0]].z);
				right_friendAttr3.setXYZ(_index,this.mapCoords[this.mapCoords[j].friends[1]].x, this.mapCoords[this.mapCoords[j].friends[1]].y, this.mapCoords[this.mapCoords[j].friends[1]].z);
				right_friendAttr4.setXYZ(_index,this.mapCoords[this.mapCoords[j].friends[2]].x, this.mapCoords[this.mapCoords[j].friends[2]].y, this.mapCoords[this.mapCoords[j].friends[2]].z);
				//console.log(right_friendAttr2.getX(_index) + " " + right_friendAttr2.getY(_index) + " " + right_friendAttr2.getZ(_index));
			}
		});
		
//		positionAttribute.needsUpdate = true;
//		colorAttr.needsUpdate = true;
//		sizesAttr.needsUpdate = true;

//		right_friendAttr0.needsUpdate = true; 
//		right_friendAttr1.needsUpdate = true; 
		right_friendAttr2.needsUpdate = true; 
		right_friendAttr3.needsUpdate = true; 
		right_friendAttr4.needsUpdate = true; 

	}

	// x,y number of squares
	generateProjectionMap(regen){									
		let positionAttribute;
		let right_friendAttr0;
		let right_friendAttr1;
		let right_friendAttr2;
		let right_friendAttr3;
		let right_friendAttr4;
		let sizesAttr;
		let colorAttr;

		if (!regen){
			
			positionAttribute = this.particlesMap.geometry.getAttribute( 'position' );
			// need to get right_friend and size
			right_friendAttr0 = this.particlesMap.geometry.getAttribute( 'right_friend0' );
			right_friendAttr1 = this.particlesMap.geometry.getAttribute( 'right_friend1' );
			right_friendAttr2 = this.particlesMap.geometry.getAttribute( 'right_friend2' );
			right_friendAttr3 = this.particlesMap.geometry.getAttribute( 'right_friend3' );
			right_friendAttr4 = this.particlesMap.geometry.getAttribute( 'right_friend4' );

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
				point.x = rotatedX ;
				point.y = rotatedY ;

				// Move it on display
				const fpoint = this.toScreenPosition(point, kx, ky);

				positionAttributeSquare.setXYZ(i, fpoint.x, fpoint.y, fpoint.z);
			}

			positionAttributeSquare.needsUpdate = true;

			for ( var j = 0; j < this.mapCoords.length; j++ ) {					

				var x = this.R * Math.cos(this.mapCoords[j].theta) * Math.cos(this.mapCoords[j].fi);
				var y = this.R * Math.cos(this.mapCoords[j].theta) * Math.sin(this.mapCoords[j].fi);
				var z = this.R * Math.sin(this.mapCoords[j].theta);
	
				this.mapCoords[j].x = x;
				this.mapCoords[j].y = y;
				this.mapCoords[j].z = z;

				const vec = new THREE.Vector3(x,y,z);

				// go for the intersection
				let raycaster = new THREE.Raycaster();

				let point1 = new THREE.Vector3(vec_origin.x, vec_origin.y, vec_origin.z);
				let point2 = new THREE.Vector3(vec.x, vec.y, vec.z);
				
				let direction = new THREE.Vector3().subVectors(point2, point1).normalize();
				raycaster.set(point1, direction);

				let intersects = raycaster.intersectObject(this.square_surface_list[n]);

				if (intersects.length <= 0) {

				} else {
					
					let intersectionPoint = intersects[0].point;
					
					this.square_surface_list[n].worldToLocal(intersectionPoint);
					intersectionPoint.applyQuaternion(q_inverse);

					vec.x = intersectionPoint.x;
					vec.y = intersectionPoint.y;
					vec.z = intersectionPoint.z;
							
					let point = vec;
					// Rotate the points around the center of the square to make it horizontal
					const rotatedX = (point.x - centerX) * Math.cos(angle) - (point.y - centerY) * Math.sin(angle) + centerX;
					const rotatedY = (point.x - centerX) * Math.sin(angle) + (point.y - centerY) * Math.cos(angle) + centerY;
					point.x = rotatedX ;
					point.y = rotatedY ;
					const vdest = this.toScreenPosition(point, kx, ky);

					this.rfcolor = this.color;
					this.color.setHSL( vindex / this.maxvindex, 1.0, 0.8 );
					//this.color.setHSL( 0.4, 1.0, 0.5 );
				
					if (!regen){											
						positionAttribute.setXYZ( vindex, vdest.x, vdest.y, vdest.z);						

						//if (kx%this.prjMapData.x == 2 && ky%this.prjMapData.y == 2){
						if ((kx > 0 && kx<this.prjMapData.y - 1) && (ky > 0 && ky<this.prjMapData.x - 1)){
							colorAttr.setXYZ( vindex,  this.color.r, this.color.g, this.color.b  );
							right_friendAttr0.setXYZ( vindex, this.rfcolor.r,kx, ky );
							right_friendAttr1.setXYZ( vindex, 10*Math.sin(vdest.x*Math.PI/this.prjMapData.square_size_x),10*Math.cos(Math.PI*vdest.y*0.5/this.prjMapData.square_size_y), 0 );
							right_friendAttr2.setXYZ( vindex, this.rfcolor.r,kx, ky );
							right_friendAttr3.setXYZ( vindex, this.rfcolor.r,kx, ky );
							right_friendAttr4.setXYZ( vindex, this.rfcolor.r,kx, ky );
						}else{
							colorAttr.setXYZ( vindex,  0.4, 0.4, 0.8  );
							right_friendAttr0.setXYZ(vindex,0,0,0);
							right_friendAttr1.setXYZ(vindex,0,0,0);
							right_friendAttr2.setXYZ(vindex,0,0,0);
							right_friendAttr3.setXYZ(vindex,0,0,0);
							right_friendAttr4.setXYZ(vindex,0,0,0);
						}

						let x = (vindex+n)%(2*10);
						if (x>10) x = (11 - x%10);						

						sizesAttr.setXYZ( vindex, x + 1);

						if (vindex > positionAttribute.count){
							console.log("vindex > positionAttribute.count");
							return false;
						}

					}else{
						this.right_friend0.push( this.rfcolor.r,kx, ky );
						this.right_friend1.push( this.rfcolor.r,kx, ky );
						this.right_friend2.push( this.rfcolor.r,kx, ky );
						this.right_friend3.push( this.rfcolor.r,kx, ky );
						this.right_friend4.push( this.rfcolor.r,kx, ky );

						this.colors.push( 0.7, 0.7, 0.7 );		
						let x = (vindex+n)%(2*10);
						if (x>10) x = (11 - x%10);
						//this.sizes.push( x/4.0 + 2 );
						this.sizes.push( x +1);
						//this.sizes.push( 100);
						this.pointsMap.push (vdest);
						this.activeMapCoords.push ({_index:vindex,kx:kx,ky:ky,j:j});		
						//console.log(this.activeMapCoords[vindex]);
					} 

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
		}else{		
			this.particlesMap.geometry.setDrawRange( 0, vindex )
			this.maxvindex = vindex;
			positionAttribute.needsUpdate = true;
			colorAttr.needsUpdate = true;
			sizesAttr.needsUpdate = true;

			right_friendAttr0.needsUpdate = true; 
			right_friendAttr1.needsUpdate = true; 
			right_friendAttr2.needsUpdate = true; 
			right_friendAttr3.needsUpdate = true; 
			right_friendAttr4.needsUpdate = true; 


			//this.particlesMap.geometry.computeBoundingBox();
			//this.particlesMap.geometry.computeBoundingSphere();
			//console.log("vindex Update" + vindex + "out of " + this.particlesMap.geometry.attributes.position.count);
			return true;
		}

		//return new THREE.Points( this.geometryMap, new THREE.PointsMaterial( { color: 0x22AAFF } ) );
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

		let vertices = [];
		let indices = [];
		// Add the points as vertices
		for (let i = 0; i < points.length - 1; i++) {
			vertices.push(points[i].x, points[i].y, points[i].z);
		}
		// Define the vertices that make up each of the two triangles
		indices.push(0, 1, 2); // First triangle
		indices.push(0, 2, 3); // Second triangle
		
		geometry_surface.setIndex(indices);
		geometry_surface.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		
		let material_surface = new THREE.MeshBasicMaterial({ color: 0xffaaff, side: THREE.DoubleSide });
		let mesh = new THREE.Mesh(geometry_surface, material_surface);

		this.square_list.push(line);
		this.square_flat_list.push(line_flat);
		this.square_surface_list.push(mesh);
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
		}

		this.square_flat_group.position.z = 250;
		return square_group;
	}
	

	loadRandomMap1(){
		// add another 1000 particles on the sphere
		for ( let i = 0; i < 100; i ++ ) {					
			var fi = THREE.MathUtils.randFloatSpread( Math.PI);
			var theta = THREE.MathUtils.randFloatSpread( 2*Math.PI );

			this.mapCoords.push(new MapCoord(fi,theta));								
		}				
	}


	loadRandomMap(){
		// add another 1000 particles on the sphere
		for ( let i = 0; i < 100; i ++ ) {					
			//var fi = THREE.MathUtils.randFloatSpread( Math.PI );
			var fi = 2*Math.PI/10 *(i%8);
			//var theta = THREE.MathUtils.randFloatSpread( 2*Math.PI/3 * (i%3) );
			var theta =  2*Math.PI/8 * (i%5) ;

			this.mapCoords.push(new MapCoord(fi,theta));								
		}				
	}

	loadFromRaw(){
		for (let i = 0; i < this.mapCoordsRaw.length;i++ ){
			this.mapCoords.push( new MapCoord( Math.PI - 
				this.mapCoordsRaw[i][0]*(2*Math.PI)/180, -this.mapCoordsRaw[i][1]*2*Math.PI/180));
			//console.log(mapCoordsRaw[i]);
		}

		for (let i = 0; i < this.mapCoordsRaw1.length;i++ ){
			this.mapCoords.push( new MapCoord( Math.PI - this.mapCoordsRaw1[i][0]*(2*Math.PI)/180, -this.mapCoordsRaw1[i][1]*2*Math.PI/180));
			//console.log(mapCoordsRaw1[i]);
		}
	}

	updateMapCoords(){
		for (let i=0;i<this.mapCoords.length;i++){
			this.mapCoords[i].fi = (i%80)*Math.PI/40.0;
			this.mapCoords[i].theta = (i%800)*Math.PI/400.0 + Math.PI/2.0;
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

			var x = this.R * Math.cos(this.mapCoords[j].theta) * Math.cos(this.mapCoords[j].fi);
			var y = this.R * Math.cos(this.mapCoords[j].theta) * Math.sin(this.mapCoords[j].fi);
			var z = this.R * Math.sin(this.mapCoords[j].theta);

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



