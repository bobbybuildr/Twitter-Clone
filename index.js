import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const user = "@Scrimba"

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replyBtn){
        handleReplyBtnClick(e.target.dataset.replyBtn)
    }
    else if(e.target.dataset.delete){
        handleDeleteTweetClick(e.target.dataset.delete)
    }
    else if(e.target.dataset.deleteReply){
        handleDeleteReplyClick(e.target.dataset.tweet, e.target.dataset.deleteReply)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    const replyEl = document.getElementById(`replies-${replyId}`)
    replyEl.classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: user,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleReplyBtnClick(replyId) {
    const replyText = document.getElementById(`reply-text-${replyId}`)

    if (replyText.value) {
        const targetTweetObj = tweetsData.filter(function(tweet) {
            return tweet.uuid === replyId
        })[0]
        targetTweetObj.replies.unshift(
            {
                handle: user,
                profilePic: `images/scrimbalogo.png`,
                tweetText: replyText.value,
                replyUuid: uuidv4()
            }
        )

        render(replyId)
    }
}

function handleDeleteTweetClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function(tweet) {
    return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.handle === user) {
        tweetsData.splice(tweetsData.indexOf(targetTweetObj),1)
    }

    render()
}

function handleDeleteReplyClick(tweetId, replyId) {
    const targetTweetObj = tweetsData.filter(function(tweet) {
        return tweet.uuid === tweetId
    })[0]
    const targetReplyObj = targetTweetObj.replies.filter(function(reply) {
        return reply.replyUuid === replyId
    })[0]

    console.log(targetReplyObj)

    targetTweetObj.replies.splice(targetTweetObj.replies.indexOf(targetReplyObj),1)

    render(tweetId)
}

function getFeedHtml(replyId){
    let feedHtml = ``
    let replyHiddenClass = "hidden"
    let deleteBtnHiddenClass = "hidden"
    
    tweetsData.forEach(function(tweet){
        
        if (tweet.uuid === replyId) {
            replyHiddenClass = ""
        } else {
            replyHiddenClass = "hidden"
        }

        if (tweet.handle === user) {
            deleteBtnHiddenClass = ""
        } else {
            deleteBtnHiddenClass = "hidden"
        }
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = `
        <div class="tweet-reply">
            <div class="tweet-inner">
                <img src="images/scrimbalogo.png" class="profile-pic">
                <textarea  id="reply-text-${tweet.uuid}" data-reply-text="${tweet.uuid}" placeholder="What's your reply?"></textarea>
            </div>
            <button id="reply-btn-${tweet.uuid}" data-reply-btn="${tweet.uuid}" role="button">Reply</button>
        </div>
        `
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                let replyUuid = ""
                if (reply.replyUuid) {
                    replyUuid = reply.replyUuid
                }
                
                let replyDeleteBtnClass = "hidden"
                if (reply.handle === user) {
                    replyDeleteBtnClass = ""
                }
                
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <span class="delete-tweet-btn ${replyDeleteBtnClass}">
                <i class="fa-solid fa-x"
                data-tweet="${tweet.uuid}" data-delete-reply="${replyUuid}"
                ></i>
            </span>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <span class="delete-tweet-btn ${deleteBtnHiddenClass}">
                <i class="fa-solid fa-x"
                data-delete="${tweet.uuid}"
                ></i>
            </span>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="${replyHiddenClass}" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(replyId){
    document.getElementById('feed').innerHTML = getFeedHtml(replyId)
}

render()

