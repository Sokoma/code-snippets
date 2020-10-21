import React from 'react';

const Search = ({getQuery}) => {

    const onChange = (topic) => {
        getQuery(topic);
    }

    return (
        <section className="common-section">
            <form>
            <select className="topic-select" name="topics" id="topics" placeholder='Select topics' onChange={(event) => onChange(event.target.value)}>
                <option value="all">All</option>
                <option value="travel">Travel</option>
                <option value="opinion">Opinion</option>
                <option value="health">Health</option>
                <option value="style">Style</option>
                <option value="u.s">U.S.</option>
                <option value="podcasts">Podcasts</option>
                <option value="movies">Movies</option>
            </select>
            </form>
        </section>
    )
}

export default Search;