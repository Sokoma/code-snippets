import React from 'react';
import NewsItem from './newsItem';

const NewsBlock = ({news, isLoading}) => {
    return isLoading ? (<h1>Loading...</h1>) : (
        <section className="newsBlock">
            {news.map(newsItem => (
                <NewsItem key={newsItem.slug_name} item={newsItem} />
            ))
        }
        </section>
    ) 
}

export default NewsBlock;

