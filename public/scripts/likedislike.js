window.onload = function () {
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');
    likeBtn.addEventListener('click', function (e) {
        let postId = likeBtn.dataset.post
        reqLikeDislike('likes', postId)
            .then(res => res.json())
            .then(data => {
                let likeText = data.liked ? 'liked' : 'like'
                likeText = likeText + ` ( ${data.totalLikes} ) `
                let dislikeText = `Dislike ( ${data.totalDislikes})`

                likeBtn.innerHTML = likeText
                dislikeBtn.innerHTML = dislikeText
            })
            .catch(e => {
                console.log(e)
                alert(e.response.data.error)
            })
    })

    dislikeBtn.addEventListener('click', function (e) {
        let postId = dislikeBtn.dataset.post
        reqLikeDislike('dislikes', postId)
            .then(res => res.json())
            .then(data => {
                let dislikeText = data.disliked ? 'disliked' : 'dislike'
                dislikeText = dislikeText + ` ( ${data.totalDislikes} ) `
                let likeText = `Like ( ${data.totalLikes} )`

                dislikeBtn.innerHTML = dislikeText
                likeBtn.innerHTML = likeText
            })
            .catch(e => {
                console.log(e)
                alert(e.response.data.error)
            })
    })

    function reqLikeDislike(type, postId) {

        let headers = new Headers()
        headers.append('Accept', 'Application/JSON')
        headers.append('Content-Type', 'Application/JSON')

        let req  = new Request(`/api/${type}/${postId}`, {
            method: 'GET',
            headers,
            mode: 'cors'
        })

        return fetch(req)
    }
}