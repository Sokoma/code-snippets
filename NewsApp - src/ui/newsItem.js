import React from 'react';

const NewsItem = ({ item }) => {
    let itemColor = 'default-color';
    if (item.section) {
       switch (item.section) {
           case 'Travel':
               itemColor = 'aqua-color';
               break;
            case 'Opinion':
                itemColor = 'lightCoral-color';
                break;
            case 'Health':
                itemColor = 'red-color';
                break;
            case 'Style':
                itemColor = 'purple-color';
                break;
            case 'U.S.':
                itemColor = 'blue-color';
                break;
            case 'Podcasts':
                itemColor = 'yellow-color';
                break;
            case 'Movies':
                itemColor = 'blanchedAlmond-color';
                break;
            case 'Arts':
                itemColor = 'lightPink-color';
                break;
            case 'Business':
                itemColor = 'grey-color';
                break;
            case 'Books':
                itemColor = 'brown-color';
                break;
       }
    }
    let imageUrl = 'url("https://weartv.com/resources/media/9cba8ae2-dc53-424e-b58c-f7e828923d0e-large16x9_GettyImages82046046.jpg?1594843562819")';
    if (item.multimedia) {
        imageUrl = 'url("' + item.multimedia[2].url + '")';
    }
    return (
        <div className={"news-item " + itemColor}>
           <a target="_blank" href={item.url}><div className="news-image" style={{backgroundImage: imageUrl}}>
            </div></a>
            <div className="news-content">
                <h2>{item.title}</h2>
                <p>{item.abstract}</p>
            </div>
        </div>
    )
}

export default NewsItem;
