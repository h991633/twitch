var nowPagination = ''
var isNowloading = false
function getData(cb) {
    isNowloading = true
    const clientId = 'icvc2hv3uuzt1elx2epln2cyexno9n'
    const Authorization = 'Bearer apm4yfa71slsox381x6fj776q8ad3v'
    // const game_id='21779'
    // const language='zh'
    // const first='20'
    var xhr = new XMLHttpRequest()
    xhr.open(
        'get',
        'https://api.twitch.tv/helix/streams?first=20&game_id=21779&language=zh&after=' + nowPagination,
        true
    )
    xhr.setRequestHeader('Authorization', Authorization)
    xhr.setRequestHeader('Client-ID', clientId)
    xhr.send()

    xhr.onload = function () {
        //console.log(xhr.responseText);
        //判斷 HTTP 狀態碼是否成功連線
        if (xhr.status == 200) {
            //把抓到的資料加以運用
            var str = JSON.parse(xhr.responseText)
            // console.log(str)
            cb(null, str)
        } else {
            console.log('資料讀取錯誤!!')
        }
    }
}
function dataHandling() {
    getData((err, apiData) => {
       
        const {
            data,
            pagination: { cursor },
        } = apiData
        const $row = $('.row')
        for (let stream of data) {
            $row.append(getColumn(stream))
        }
        nowPagination = cursor
        isNowloading = false
        
    })
}
if (!isNowloading) {
    dataHandling()
}
function getColumn(data) {
    return `<div class="col">
                    <div class="placeholder"></div>
                    <div class="preview"><img src="${data.thumbnail_url.replace(
                        '{width}x{height}',
                        '320x180'
                    )}" onload="this.style.opacity=1" /></div>

                    <div class="bottom">
                        <div class="avatar"><img src="Spongebob_SquarePants.jpg" /></div>
                        <div class="intro">
                            <div class="channel_name">${data.title}</div>
                            <div class="owner_name">${data.user_name}</div>
                        </div>
                    </div>
                </div>`
}
$(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
        
        if (!isNowloading) {
            dataHandling()
        }
    }
})
