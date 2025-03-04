import React from 'react'

function CommunityPost() {
const dummyData=[{
    "author":"dev",
    "uploadedAt":"5 min ago",
    "content":"this is the post content......",
    "Totalanswers":5,


},
{
    "author":"sunny",
    "uploadedAt":"19 min ago",
    "content":"this is the post content of sunny......",
    "Totalanswers":15,
    

}

]
    


  return (
    <div>
        {dummyData.map((post,index)=>
            <div key={index}>
            by:{post.author},
            </div>
        )}
    </div>
  )
}

export default CommunityPost