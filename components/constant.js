const stopNameList = {
    "Administration Square":{"tw":"行政大樓","cn":"行政大楼","en":"Administration Building","jp":"行政棟"},
    "Administration Building":{"tw":"行政大樓","cn":"行政大楼","en":"Administration Building","jp":"行政棟"},
    "Dorm H":{"tw":"H棟宿舍","cn":"H栋宿舍","en":"H Dormitory","jp":"H 学生寮"},
    "H Dormitory":{"tw":"H棟宿舍","cn":"H栋宿舍","en":"H Dormitory","jp":"H 学生寮"},
    "Activity Center":{"tw":"活動中心","cn":"活动中心","en":"Activity Center","jp":"アクティビティセンター"},
    "Wuling Road":{"tw":"武嶺路口","cn":"武岭路口","en":"Wuling Road","jp":"武嶺交差点"},
    "College of Liberal Arts":{"tw":"文學院","cn":"文学院","en":"College of Liberal Arts","jp":"文学院"},
    "MRT Sizihwan Station (LRT Hamasen Station)":{"tw":"捷運西子灣站 (輕軌哈瑪星站)","cn":"捷运西子湾站(轻轨哈玛星站)","en":"MRT Sizihwan Station (LRT Hamasen Station)","jp":"MRT西子湾駅(LRT哈瑪星駅)"},
    "未行駛":{"tw":"未行駛","cn":"未行驶","en":"Not in service","jp":"運休"},
};
const aboutList = {"tw":"約", "cn": "约", "en":"About", "jp": "約"};
const timeList = {"tw":"分", "cn": "分", "en":"min", "jp": "分"};
const approachingList = {"tw":"即將進站", "cn": "即将进站", "en":"Arriving", "jp": "到着します"};
const arrivingList = {"tw":"接近", "cn": "接近", "en":"Approaching", "jp": "接近"};
const departureList = {"tw":"已離站", "cn": "已离站", "en":"Departure", "jp": "発車した"};
function startLaoding(){
    $(".loading_background").fadeIn(500);
}
function endLaoding(){
    $(".loading_background").fadeOut(1000);
}