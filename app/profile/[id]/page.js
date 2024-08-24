"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const OthersProfile = () => {
    const userId = usePathname().split('/').pop();
    const params = useSearchParams();
    const username = params.get("username");
    console.log('USERNAME = ', username);
    const [posts, setPosts] = useState([]);
    const [userDetails, setUserDetails] = useState({})


    useEffect(() => {
        const fetchUserDetails = async () => {
            const response = await fetch(`/api/users/${userId}/posts`);
            const userPosts = await response.json();

            setPosts(userPosts);
            console.log(userPosts)
            setUserDetails(userPosts[0].creator);
        }
        if (userId)
            fetchUserDetails();
    }, [])


    return (
        <Profile
            name={username}
            desc={`Welcome to ${username}'s personalized profile page`}
            data={posts}
        />
    )
}

export default OthersProfile