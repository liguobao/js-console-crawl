// 打开对应的Amazon列表页，手动翻到第一页
// 打开浏览器控制台
// 贴入下面的脚本，观察输出日志
// 抓取完成后自动生成csv文件弹出下载框

function downloadJSON2CSV(objArray, filename) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var csvText = '';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        // for (var index in array[i]) {
        //     line += array[i][index] + ',';
        // }
        //添加双引号
        for (var index in array[i]) {
            line += '\"' + array[i][index] + '\",';
        }
        line.slice(0, line.Length - 1);
        csvText += line + '\r';
    }
    if (!filename) filename = "book_" + new Date().valueOf() + '.csv'
    var blob = new Blob(
        [
            new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
            csvText
        ],
        { type: "text/plain;charset=utf-8" }
    );
    e = document.createEvent('MouseEvents');
    a = document.createElement('a');
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/csv;charset=utf-8', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e)
}


var books = []
var maxPage = 10;
if (document.getElementsByClassName("a-disabled").length == 2) {
    maxPage = document.getElementsByClassName("a-disabled")[1].textContent;
} else {
    document.getElementsByClassName("a-disabled")[0].textContent;
}
console.log("当前页面总页数:" + maxPage);
var pageIndex = 1;
var dt = setInterval(function () {
    var bookDivList = document.getElementsByClassName("sg-col-4-of-12 sg-col-8-of-16 sg-col-12-of-32 sg-col-12-of-20 sg-col-12-of-36 sg-col sg-col-12-of-24 sg-col-12-of-28");
    for (var index = 0; index < bookDivList.length; index++) {
        var bookDiv = bookDivList[index];
        var bookVolumeName = bookDiv.getElementsByTagName("a")[0].getElementsByTagName("span")[0].textContent;
        var totalReview = bookDiv.getElementsByClassName("a-row a-size-small")[0].getElementsByClassName("a-size-base")[0].textContent;
        var bookName = bookVolumeName.split(":")[0];
        var volumePrice = 0.0;
        if (bookDiv.parentNode.parentNode.getElementsByClassName("a-price").length > 0) {
            volumePrice = bookDiv.parentNode.parentNode.getElementsByClassName("a-price")[0].getElementsByClassName("a-offscreen")[0].textContent;
        }
        var bookItem = {
            "bookVolumeName": bookVolumeName,
            "bookName": bookName,
            "totalReview": totalReview,
            "volumePrice": volumePrice
        }
        books.push(bookItem);
    }
    console.log("正在获取【" + pageIndex + "】数据......");
    if (document.getElementsByClassName("a-last").length == 0) {
        console.log("找不到下一页, 暂时休息一会.");
        return;
    }
    if (document.getElementsByClassName("a-last")[0].getElementsByTagName("a").length !== 0) {
        document.getElementsByClassName("a-last")[0].getElementsByTagName("a")[0].click();
        pageIndex = pageIndex + 1;
    } else {
        clearInterval(dt);
        console.log("获取全部数据成功，当前数据总数：" + books.length);
        console.log("开始下载...");
        downloadJSON2CSV(books);
    }
}, 3000);