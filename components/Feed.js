"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import { useRouter } from "next/navigation";


const PromptCardList = ({ data, handleTagClick, handleProfileClick }) => {

    return (
        <div className="mt-16 prompt_layout">
            {data.map(post => (
                <PromptCard
                    key={post._id}
                    post={post}
                    handleTagClick={() => handleTagClick(post.tag)}
                    handleProfileClick={() => handleProfileClick(post?.creator._id, post?.creator.username)}
                />
            )
            )}
        </div>
    )
}

const Feed = () => {
    console.log('Feed Rendered...')
    const [searchText, setSearchText] = useState('');
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([]);
    const router = useRouter();

    let timeoutId = '';

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    }

    const checkPost = (post) => {
        const target = `${post.creator.username} ${post.tag} ${post.prompt}`.toLowerCase();
        return target.includes(searchText);
    }

    const handleSearch = () => {
        let filteredItems = [];
        if (searchText.trim() === "") {
            setFilteredPosts([])
            return;
        }

        filteredItems = posts.filter(p => checkPost(p));
        console.log(filteredItems)
        setFilteredPosts(filteredItems);
    }

    useEffect(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleSearch, 1000)
    }, [searchText])

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/prompt');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.log(error)
            }

        }
        fetchPosts();
    }, [])

    return (
        <section className="feed">
            <form className="relative w-full flex-center">
                <input
                    input="text"
                    placeholder="Search for a tag or a username"
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className="search_input peer"

                />
            </form>
            <PromptCardList
                data={filteredPosts.length > 0 ? filteredPosts : posts}
                handleProfileClick={(id, username) => {
                    router.push(`/profile/${id}?username=${username}`);
                }}
                handleTagClick={(tag) => {
                    setSearchText(tag)
                }}
            />

        </section>
    )
}

export default Feed