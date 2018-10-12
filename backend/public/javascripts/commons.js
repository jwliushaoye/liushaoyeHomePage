// 时间格式化
exports.transformationTime = function(time , linkF = '-' , linkL = ':'){
    let timeNum = new Date(time);
     const Year = timeNum.getFullYear();
    const Mounth = parseInt(timeNum.getMonth()) + 1 >= 10 ? parseInt(timeNum.getMonth()) + 1 : '0' + parseInt(timeNum.getMonth() + 1);
    const Day = timeNum.getDate() >= 10 ? timeNum.getDate() : '0' + timeNum.getDate();
    const Hour = timeNum.getHours() >= 10 ? timeNum.getHours() : '0' + timeNum.getHours();
    const Minutes = timeNum.getMinutes() >= 10 ? timeNum.getMinutes() : '0' + timeNum.getMinutes();
    const Seconds = timeNum.getSeconds() >= 10 ? timeNum.getSeconds() : '0' + timeNum.getSeconds();
    
    return `${Year}${linkF}${Mounth}${linkF}${Day} ${Hour}${linkL}${Minutes}${linkL}${Seconds}`;
}