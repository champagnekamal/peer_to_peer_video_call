import React, { useEffect, useState } from "react"

const GoogleTrends:React.FC = () => {
const [data,setData] = useState([])
const callgoogletrends = async () => {
    const response = await fetch("peertopeervideocallserver-production.up.railway.app/getTrendingSearches")
    const data = await response.json()
    setData(data)
}

useEffect(()=>{
callgoogletrends()
},[])

    return (
        <>
        <div className="trending_section">
        <h4>What's Trending</h4>
        <ul>
            {
                data?.map((e:any,i)=>
                    <li key={i}>
                        #{e.title.query}
                    </li>
                )
            }
        </ul>
        </div>
       
        </>
    )
}

export default GoogleTrends;