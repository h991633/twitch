var nowPagination = ''
var isNowloading = false
function getData(cb) {
    //cb就是我塞的cb fuc
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
        const $row = document.querySelector('.row')
        for (let stream of data) {
            const div = document.createElement('div')
            $row.appendChild(div)
            div.outerHTML = getColumn(stream)
            
        }
       
        
        nowPagination = cursor
        isNowloading = false
    })
}
if (!isNowloading) {
    dataHandling()
}
function getColumn(data) {
    return `
                <div class="col">
                    <div class="placeholder"></div>
                    <a href="https://www.twitch.tv/${data.user_login}">
                    <div class="preview"><img src="${data.thumbnail_url.replace(
                        '{width}x{height}',
                        '320x180'
                    )}" onload="this.style.opacity=1" /></div>
                    </a>
                    <div class="bottom">
                        <div class="avatar"><img src="Spongebob_SquarePants.jpg" /></div>
                        <div class="intro">
                            <div class="channel_name">${data.title}</div>
                            <div class="owner_name">${data.user_name}</div>
                        </div>
                    </div>
                </div>
            `
}
window.addEventListener('scroll', function () {
    console.log(
        'window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop',
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    )
    console.log('window.innerHeight', window.innerHeight)
    console.log('document.documentElement.scrollHeight', document.documentElement.scrollHeight)
    if (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop + window.innerHeight > document.documentElement.scrollHeight - 100
    ) {
        if (!isNowloading) {
            dataHandling()
        }
    }
})
