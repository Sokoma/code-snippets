import React, { useState, useEffect } from 'react';
import Header from './ui/header';
import NewsBlock from './ui/newsBlock';
import Search from './ui/search';
import './App.css';

const App = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('all');
  

  useEffect(() => {
    const options = {
      method: 'GET'
    }
    const fetchNews = async () => {
      let response = await fetch(`https://api.nytimes.com/svc/news/v3/content/all/${query}.json?api-key=MYKEY`, options)
      response  = await response.json()
      setNews(response.results);
      setIsLoading(false);
    }
    fetchNews();
    
  }, [query])

  return (
    <div className="App">
      <div className="page-frame">
      <section className="common-section">
      <h1>News Feed</h1>
      <Header />
      </section>
      <Search getQuery={(topic) => setQuery(topic)} />
      <NewsBlock news={news} isLoading={isLoading}/>
      </div>
    </div>
  );
}

export default App;
