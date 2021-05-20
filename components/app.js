const stopNameList = {
    "Administration Square": {
        "tw":"行政大樓","cn":"行政大楼","en":"Administration Building","jp":"行政棟"
    },
    "Administration Building": {
        "tw":"行政大樓","cn":"行政大楼","en":"Administration Building","jp":"行政棟"
    },
    "Dorm H": {
        "tw":"H棟宿舍","cn":"H栋宿舍","en":"H Dormitory","jp":"H 学生寮"
    },
    "H Dormitory": {
        "tw":"H棟宿舍","cn":"H栋宿舍","en":"H Dormitory","jp":"H 学生寮"
    },
    "Activity Center": {
        "tw":"活動中心","cn":"活动中心","en":"Activity Center","jp":"アクティビティセンター"
    },
    "Wuling Road": {
        "tw":"武嶺路口","cn":"武岭路口","en":"Wuling Road","jp":"武嶺交差点"
    },
    "College of Liberal Arts": {
        "tw":"文學院","cn":"文学院","en":"College of Liberal Arts","jp":"文学院"
    },
    "MRT Sizihwan Station (LRT Hamasen Station)": {
        "tw":"捷運西子灣站 (輕軌哈瑪星站)","cn":"捷运西子湾站(轻轨哈玛星站)","en":"MRT Sizihwan Station (LRT Hamasen Station)","jp":"MRT西子湾駅(LRT哈瑪星駅)"},
    "未行駛": {
        "tw":"未行駛","cn":"未行驶","en":"Not in service","jp":"運休"
    },
}
const aboutList = {"tw":"約", "cn": "约", "en":"About", "jp": "約"};
const timeList = {"tw":"分", "cn": "分", "en":"min", "jp": "分"};
const approachingList = {"tw":"即將進站", "cn": "即将进站", "en":"Arriving", "jp": "到着します"};
const arrivingList = {"tw":"接近", "cn": "接近", "en":"Approaching", "jp": "接近"};
const departureList = {"tw":"已離站", "cn": "已离站", "en":"Departure", "jp": "発車した"};
function startLaoding(){
    $(".loading_background").fadeIn(500);
}
function endLaoding(){
    $(".loading_background").fadeOut(500);
}
//vue app
const app = Vue.createApp({
    template: '<app-title :title-lang="lang_code" /><app-content :app-lang="lang_code" :current-page="current_page" :signal="signal" @changeLang="changeLang" @changePage="changePage" /><app-navigator :nav-lang="lang_code" @changePage="changePage" />',
    data(){
        return {
            current_page: 0,
            lang_code: "tw",
            signal: 0,
        }
    },
    methods:{
        changeLang(val){
            this.lang_code=val;
            localStorage.langCode=val;
        },
        changePage(val){
            this.current_page=val;
        },
        updateSignal(){
            var _this = this;
            setInterval(function(){
                _this.signal+=1;
            },10000);
        }
    },
    created(){
        if(localStorage.langCode){
            this.lang_code=localStorage.langCode;
        }
        this.signal = 0;
        this.updateSignal();
    },
});
//App Title
app.component('app-title',{
    template: '<div class="banner shadow"><div id="title">{{title}}</div></div>',
    data(){
        return {
            title : ""
        }
    },
    props: ['titleLang'],
    methods:{
        getLang(){
            var titleList = {"tw":"校園公車資訊","cn":"校园公交信息","en":"Campus Bus Information","jp":"学内連絡バスインフォ"};
            this.title = titleList[this.titleLang];
        }
    },
    beforeMount(){
        this.getLang();
    },
    beforeUpdate(){
        this.getLang();
    }
});
//App Content
app.component('app-content',{
    template: '<div id="content_box"><div id="header"></div><marquee-box /><campus-bus-list v-if="current_page===0" v-for="i in campus_len"  :campus-data="campus_list[i-1]" @routeData="routeData" @getCampusRoute="fetchCampusRoute" /><city-bus-list v-if="current_page===1 && (app_lang==\'tw\' || app_lang==\'cn\')" v-for="i in city_len"  :city-data="city_list_ch[i-1]" @getCityRoute="fetchCityRoute" @routeData="routeData" /><city-bus-list v-if="current_page===1 && (app_lang==\'en\' || app_lang==\'jp\')" v-for="i in city_len"  :city-data="city_list_en[i-1]" @getCityRoute="fetchCityRoute" @routeData="routeData" /><timetable v-if="current_page===2 && (app_lang==\'tw\' || app_lang==\'cn\')" v-for="i in timetable_len"  :timetable-data="timetable_ch[i-1]" /><timetable v-if="current_page===2 && (app_lang==\'en\' || app_lang==\'jp\')" v-for="i in timetable_len"  :timetable-data="timetable_en[i-1]" /><settings v-if="current_page===3" :app-lang="app_lang" @changeLang="changeLang" /><route-content v-if="current_page===4" @changePage="changePage" :content-data-out="content_list_outbound" :content-data-in="content_list_inbound" :content-out-len="content_out_len" :content-in-len="content_in_len" :route-data="route_data" :route-page="route_page" @changeRoutePage="routePage" /><div id="footer"></div></div>',
    data(){
        return {
            current_page: 0,
            page_temp: 0,
            app_lang: this.appLang,
            campus_len: 0,
            campus_list: [],
            city_list_ch: [],
            city_len: 0,
            city_list_en: [],
            timetable_ch: [],
            timetable_len: 0,
            timetable_en: [],
            content_list_outbound:[],
            content_list_inbound:[],
            content_out_len: 0,
            content_in_len: 0,
            current_route: 0,
            route_data: [],
            route_page: 0,
            timer:0,
        }
    },
    props: ["appLang","currentPage","signal"],
    methods: {
        fetchStatus(){
            this.current_page = this.currentPage;
            this.app_lang = this.appLang;
        },
        fetchCampus(){
            var _this = this, i;
            $.getJSON("https://ibus.nsysu.edu.tw/API/RoutePath.aspx?"+Date.now()+"&C=en&T=SC",function(data){
                var nameList = {"tw": "校","cn": "校","en": "Campus","jp": "Campus"};
                var statusList = {"tw": "目前位置：","cn": "当前位置：","en": "Current Stop: ","jp": "現在地："};
                if(data.message){
                    alert("伺服器停止運作 Server is not working");
                }
                for(i=0; i<data.length; i++){
                    data[i].DepartureEn = stopNameList[data[i].DepartureEn][_this.appLang];
                    data[i].DestinationEn = stopNameList[data[i].DestinationEn][_this.appLang];
                    if(data[i].StopName=="未行駛"){
                        data[i].StopName = stopNameList[data[i].StopName][_this.appLang];
                    }else{
                        data[i].StopName = statusList[_this.appLang] + stopNameList[data[i].StopName][_this.appLang];
                    }
                    data[i].NameEn = nameList[_this.appLang]+" "+data[i].RouteID;
                    data[i].RouteID = data[i].RouteID;

                }
                _this.campus_list = data;
                _this.campus_len = data.length;
            });
        },
        fetchCity(){
            var _this = this, i;
            $.getJSON("https://raw.githubusercontent.com/nsysu-code-club/nsysu-bus/main/bus_info_data_zh.json",function(data){
                var newList={}, j=0;
                for(i=0; i<data.length; i++){
                    if(data[i].RouteID>49){
                        newList[j]={};
                        newList[j]["dept"] = data[i].Departure;
                        newList[j]["dest"] = data[i].Destination;
                        newList[j]["name"] = data[i].Name;
                        newList[j]["id"] = data[i].CarID.split(",",1)[0];
                        newList[j]["route"] = data[i].RouteID;
                        j++;
                    }
                }
                _this.city_list_ch = newList;
                _this.city_len = j;
            });
            $.getJSON("https://raw.githubusercontent.com/nsysu-code-club/nsysu-bus/main/bus_info_data_en.json",function(data){
                var newList={}, j=0;
                for(i=0; i<data.length; i++){
                    if(data[i].RouteID>49){
                        newList[j]={};
                        newList[j]["dept"] = data[i].DepartureEn;
                        newList[j]["dest"] = data[i].DestinationEn;
                        newList[j]["name"] = data[i].NameEn;
                        newList[j]["id"] = data[i].CarID.split(",",1)[0];
                        newList[j]["route"] = data[i].RouteID;
                        j++;
                    }
                }
                _this.city_list_en = newList;
            });
        },
        changeLang(val){
            this.$emit("changeLang",val);
        },
        changePage(val){
            this.$emit("changeLang",val);
        },
        fetchTimetable(){
            var _this = this, i;
            $.getJSON("https://ibus.nsysu.edu.tw/API/RouteTimeBoardName.aspx?1620312644823"+Date.now(),function(data){
                var newList={};
                for(i=0; i<data.Datas.length; i++){
                    newList[i]={};
                    newList[i]["id"] = data.Datas[i].TimeBoardID;
                    newList[i]["name"] = data.Datas[i].Name;
                }
                _this.timetable_ch = newList;
                _this.timetable_len = data.Datas.length;
            });
            $.getJSON("https://ibus.nsysu.edu.tw/API/RouteTimeBoardName.aspx?C=en",function(data){
                var newList={};
                for(i=0; i<data.Datas.length; i++){
                    newList[i]={};
                    newList[i]["id"] = data.Datas[i].TimeBoardID;
                    newList[i]["name"] = data.Datas[i].NameEn;
                }
                _this.timetable_en = newList;
            });
        },
        fetchCampusRoute(val){
            var _this = this, langCode;
            _this.current_route = val;
            $.post("https://ibus.nsysu.edu.tw/API/RoutePathStop.aspx?C=en",{CID: _this.route_data.plate, RID: val},function(data){
                var list = JSON.parse(data);
                var newListA={}, newListB={},temp, target, j=0, k=0;
                for(i=0; i<list.length; i++){
                    if(list[i].isGoBack!="Y"){
                        newListA[j] = {};
                        target = newListA[j];
                        j++;
                    }else{
                        newListB[k] = {};
                        target = newListB[k];
                        k++;
                    }
                    target["id"] = list[i].StopID;
                    target["name"] = stopNameList[list[i].NameEn][_this.appLang];
                    target["no"] = list[i].SeqNo;
                    temp = list[i].ArrivedTime;
                    if(temp.indexOf(":") < 0){
                        switch(list[i].ArrivedTime){
                            case "進站中":
                                target["arrival"] = approachingList[_this.app_lang];
                                break;
                            case "將到站":
                                target["arrival"] = arrivingList[_this.app_lang];
                                break;
                            case "已離站":
                                target["arrival"] = departureList[_this.app_lang];
                                break;
                            default:
                            target["arrival"] = aboutList[_this.app_lang] + " " + list[i].ArrivedTime + " " + timeList[_this.app_lang];
                        }
                    }
                    target["time"] = list[i].RealArrivedTime;
                }
                _this.content_list_outbound = newListA;
                _this.content_list_inbound = newListB;
                _this.content_out_len = j;
                _this.content_in_len = k;
                _this.$emit("changePage",4);
            });
        },
        fetchCityRoute(val){
            var _this = this, langCode;
            _this.current_route = val;
            if(this.app_lang=="tw" || this.app_lang=="tw"){
                langCode = "ch";
            }else{
                langCode = "en";
            }
            $.post("https://ibus.nsysu.edu.tw/API/RoutePathStop.aspx",{C: langCode, RID: val},function(data){
                var list = JSON.parse(data);
                var newListA={}, newListB={},temp, target, j=0, k=0;
                for(i=0; i<list.length; i++){
                    if(list[i].isGoBack!="Y"){
                        newListA[j] = {};
                        target = newListA[j];
                        j++;
                    }else{
                        newListB[k] = {};
                        target = newListB[k];
                        k++;
                    }
                    target["id"] = list[i].StopID;
                    if(langCode=="en"){
                        target["name"] = list[i].NameEn;
                    }else{
                        target["name"] = list[i].Name;
                    }
                    target["no"] = list[i].SeqNo;
                    temp = list[i].ArrivedTime;
                    if(temp==null){
                        target["arrival"] = departureList[_this.app_lang];
                    }else if(temp.indexOf(":") < 0){
                        switch(list[i].ArrivedTime){
                            case "進站中":
                                target["arrival"] = approachingList[_this.app_lang];
                                break;
                            case "將到站":
                                target["arrival"] = arrivingList[_this.app_lang];
                                break;
                            default:
                            target["arrival"] = aboutList[_this.app_lang] + " " + list[i].ArrivedTime + " " + timeList[_this.app_lang];
                        }
                    }else{
                        target["arrival"] = list[i].ArrivedTime;
                    }
                    target["time"] = list[i].RealArrivedTime;
                }
                _this.content_list_outbound = newListA;
                _this.content_list_inbound = newListB;
                _this.content_out_len = j;
                _this.content_in_len = k;
                _this.$emit("changePage",4);
            });
        },
        routeData(val){
            this.route_data = val;
            this.route_page = 0;
        },
        routePage(val){
            this.route_page = val;
        }
    },
    created(){
        this.fetchCampus();
        this.fetchCity();
        this.page_temp = this.current_page;
        this.timer = this.signal;
    },
    beforeUpdate(){
        this.fetchStatus();
    },
    updated(){
        if(this.current_page != this.page_temp){
            if(this.current_page==0){
                this.fetchCampus();
            }else if(this.current_page==1){
                this.fetchCity();
            }else{
                this.fetchTimetable();
            }
            this.page_temp = this.current_page;
        }else if(this.signal != this.timer){
            if(this.current_page==0){
                this.fetchCampus();
            }else if(this.current_page==1){
                this.fetchCity();
            }else if(this.current_page==4){
                if(this.current_route<50){
                    this.fetchCampusRoute(this.current_route);
                }else{
                    this.fetchCityRoute(this.current_route);
                }
            }else{
                this.fetchTimetable();
            }
            this.timer = this.signal;
        }
    },
    components: {
        'marquee-box': {
            template: '<div class="marquee shadow"><div>搭公車時請全程配戴口罩，勸導不聽者，最高可罰15,000元。Face mask must be worn when taking the bus. Those refuse to comply will be fined up to 15,000 NT dollars. バスを乗る際はマスクを着用し、違反者には最高NT$7,500元の罰金が科されます。</div></div>'
        },
        'campus-bus-list': {
            template:'<a class="a_tag" href=""><div class="campus_list shadow" @click.prevent="routeData(campusData.RouteID)"><table style="width: 100%"><tr><td rowspan="2" style="width: 150px"><span class="campus_list_name"><div>{{campusData.NameEn}}</div><div class="campus_list_plate" v-if="campusData.CarID!=null">{{campusData.CarID}}</div></span></td><td><span class="campus_list_dept">{{campusData.DepartureEn}}</span><span class="campus_list_arrow"><span class="material-icons">arrow_forward</span></span><span class="campus_list_dest">{{campusData.DestinationEn}}</span></td></tr><tr><td><span class="campus_list_stop" :class="{reded: campusData.StopName==\'未行駛\' || campusData.StopName==\'未行驶\' || campusData.StopName==\'Not in service\' || campusData.StopName==\'運休\'?true:false}">{{campusData.StopName}}</span></td></tr></table></div></a>',
            props:["campusData"],
            methods: {
                routeData(route){
                    if(this.campusData.StopName=='未行駛' || this.campusData.StopName=='未行驶' || this.campusData.StopName=='Not in service' || this.campusData.StopName=='運休'){
                        alert("無資料 No Data")
                    }else{
                        var data = {"name": this.campusData.NameEn, "dept": this.campusData.DepartureEn, "dest": this.campusData.DestinationEn, "plate": this.campusData.CarID}
                        this.$emit("routeData",data);
                        this.$emit("getCampusRoute",route);
                    }
                    
                }
            }
        },
        'city-bus-list': {
            template:'<a class="a_tag" href="" @click.prevent="routeData(cityData.route)"><div class="campus_list shadow"><table style="width: 100%"><tr><td style="width: 150px"><span class="campus_list_name"><div>{{cityData.name}}</div><div class="campus_list_plate" v-if="cityData.id!=null">{{cityData.id}}</div></span></td><td><span class="campus_list_dept">{{cityData.dept}}</span><span class="campus_list_arrow"><span class="material-icons">arrow_forward</span></span><span class="campus_list_dest">{{cityData.dest}}</span></td></tr></table></div></a>',
            props:["cityData"],
            methods: {
                routeData(route){
                    var data = {"name": this.cityData.name, "dept": this.cityData.dept, "dest": this.cityData.dest, "plate": this.cityData.id};
                    this.$emit("routeData",data);
                    this.$emit("getCityRoute",route);
                }
            }
        },
        'timetable': {
            template:'<a class="a_tag" href="" @click.prevent="openTimetable(timetableData.id)"><div class="campus_list shadow">{{timetableData.name}}</div></a>',
            props:["timetableData"],
            methods: {
                openTimetable(id){
                    $.post("https://ibus.nsysu.edu.tw/API/RouteTimeBoardPath.aspx?" + Date.now(),{"TBID": id},function(data){
                        var imagePath = JSON.parse(data);
                        if(!window.open(imagePath.TimeBoardImagePath)){
                            location.href=imagePath.TimeBoardImagePath;
                        }
                    });
                }
            }
        },
        'settings': {
            template: '<div class="settings_box shadow"><h3>語言 Language</h3><hr><select v-model="language" @change="changeLang"><option value="tw">繁體中文</option><option value="cn">简体中文</option><option value="en">English</option><option value="jp">日本語</option></select></div><div class="settings_box shadow">目前部分頁面内容不支援簡體中文和日文。<br>目前部分页面内容不支援简体中文和日语。<br>Simplified Chinese and Japanese are not available in some pages.<br>中国語(簡体字)と日本語は、一部のページに対応していません。</div>',
            props:["appLang"],
            data(){
                return {
                    language: this.appLang
                }
            },
            methods: {
                changeLang(){
                    this.$emit("changeLang",this.language);
                }
            }
        },
        'route-content': {
            template: '<div class="settings_box shadow"><h2 class="route_title">{{routeData.name}}</h2><table class="route_tab"><tr><td :class="{route_tab_active: (this.route_page==0?true : false)}"><button @click="changeRoutePage(0)">{{routeData.dept}}</button></td><td :class="{route_tab_active: (this.route_page==1?true : false)}"><button @click="changeRoutePage(1)">{{routeData.dest}}</button></td></tr></table><div class="route_content"><route-list v-if="route_page==0" v-for="i in content_out_len" :content-data="content_out[i-1]" /><route-list v-if="route_page==1" v-for="i in content_in_len" :content-data="content_in[i-1]" /></div></div>',
            props:["contentDataOut","contentDataIn","contentOutLen","contentInLen","routeData","routePage"],
            data(){
                return {
                    route_page: 0,
                    content_out: [],
                    content_in: [],
                    content_out_len: 0,
                    content_in_len: 0,
                }
            },
            methods: {
                fetchData(){
                    this.content_out = this.contentDataOut;
                    this.content_out_len = this.contentOutLen;
                    this.content_in = this.contentDataIn;
                    this.content_in_len = this.contentInLen;
                    this.route_page = this.routePage;
                },
                changeRoutePage(page){
                    this.$emit("changeRoutePage",page);
                }
            },
            created(){
                this.fetchData();
            },
            updated(){
                this.fetchData();
            },
            components: {
                'route-list': {
                    template :'<div class="campus_list shadow"><span class="campus_list_name" :class="{}"><div>{{contentData.arrival}}</div></span><span>{{contentData.name}}</span></div>',
                    props: ["contentData"]
                }
            }
        }
    }
});
//App Navigator
app.component('app-navigator',{
    template :'<div class="navigator shadow"><a href="" @click.stop.prevent="changePage(0)"><span class="material-icons">school</span><br>{{campus}}</a><a href="" @click.stop.prevent="changePage(1)"><span class="material-icons">directions_bus</span><br>{{city}}</a><a href="" @click.stop.prevent="changePage(2)"><span class="material-icons">departure_board</span><br>{{timetable}}</a><a href="" @click.stop.prevent="changePage(3)"><span class="material-icons">settings</span><br>{{settings}}</a></div>',
    data(){
        return {
            campus: "",
            city: "",
            timetable: "",
            settings: ""
        }
    },
    props: ['navLang'],
    methods: {
        getLang(){
            const campusButton = {"tw": "校園公車","cn": "校园公交","en": "Campus Bus","jp": "学内連絡バス"};
            const cityButton = {"tw": "市區公車","cn": "市区公交","en": "City Bus","jp": "市内バス"};
            const timetableButton = {"tw": "時刻表","cn": "时刻表","en": "Timetable","jp": "時刻表"};
            const settingsButton = {"tw": "設定","cn": "设置","en": "Settings","jp": "設定"};
            this.campus = campusButton[this.navLang];
            this.city = cityButton[this.navLang];
            this.timetable = timetableButton[this.navLang];
            this.settings = settingsButton[this.navLang];
        },
        changePage(page){
            this.$emit("changePage",page);
        }
    },
    beforeMount(){
        this.getLang();
    },
    beforeUpdate(){
        this.getLang();
    }
});
app.mount('#app');