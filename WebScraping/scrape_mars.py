
# coding: utf-8

# In[38]:


from bs4 import BeautifulSoup as bs
import urllib.request
import pandas as pd
from splinter import Browser
import numpy as np
import time
import re

def scrape():
# In[3]:
    scrapeOutput={}
    with urllib.request.urlopen('https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest') as response:
        Html = response.read()
    html=Html.decode("utf-8")


    # In[4]:


    soup = bs(html, 'lxml')
    # soup.prettify


    # In[5]:


    # class="content_title"

    news_title=[]
    titles = soup.find_all("div", {"class": "content_title"})

    for title in titles:
        news_title.append(title.get_text())
    news_title
    scrapeOutput['newsTitle'] = news_title

    # In[6]:


    # class="article_teaser_body"
    news_p =[]
    paragraphs = soup.find_all("div", {"class":"rollover_description_inner"})
    for paragraph in paragraphs:
        paragraphtext=paragraph.get_text()
    #     print(paragraphtext)
        news_p.append(paragraphtext)
    news_p
    scrapeOutput['news_content'] = news_p

    # In[7]:


    #https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars

    with Browser('chrome') as browser:
        # Visit URL
        url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
        browser.visit(url)
        button = browser.find_by_id('full_image')
        button.click()
        time.sleep(1)
        mySoup = bs(browser.html, 'lxml')


    # In[8]:


    # mySoup.prettify
    myBowl = mySoup.find_all('img',{'class':'fancybox-image'})[0]
    mySpoon = str(myBowl).split('src="')[1].split('" ')[0]
    featured_image_url = 'https://www.jpl.nasa.gov'+mySpoon
    featured_image_url
    scrapeOutput['featured_image_url'] = featured_image_url

    # In[9]:


    #https://twitter.com/marswxreport?lang=en
    with urllib.request.urlopen('https://twitter.com/marswxreport?lang=en') as response:
        Html1 = response.read()
    html1=Html1.decode("utf-8")


    # In[10]:


    soup = bs(html1, 'lxml')
    tweets = soup.find_all("p", {"class": "TweetTextSize TweetTextSize--normal js-tweet-text tweet-text"})
    mars_weather =tweets[1].get_text()
    mars_weather

    scrapeOutput['mars_weather'] = mars_weather
    # In[13]:


    #table
    url = 'https://space-facts.com/mars/'
    tables = pd.read_html(url)[0]
    myTable = tables.to_html()
    scrapeOutput['tables'] = myTable

    # In[87]:


    #images
    # https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars

    hemisphere_image_urls = []
    with Browser("chrome") as browser2:
        url2="https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
        browser2.visit(url2)
        mySoup2 = bs(browser2.html, 'lxml')
        imagelinks= mySoup2.find_all("a", {"class":"itemLink product-item"})
    imagelinks


    # In[90]:


    clearlinks =[]
    title=[]
    for i,tag in enumerate(imagelinks):
        if i%2==0:
            clearlinks.append('https://astrogeology.usgs.gov'+tag.get('href'))
            title.append(str(tag).split('img alt="')[1].split('thumbnail')[0].strip())
    clearlinks
    title


    # In[91]:


    html_text = []
    with Browser("chrome") as browser3:
        for clearlink in clearlinks:
            browser3.visit(clearlink)
            button = browser3.find_by_id('wide-image-toggle')
            button.click()
            m = re.search('/cache.*jpg',browser3.html)
            print(m.group(0))
            html_text.append('https://astrogeology.usgs.gov'+m.group(0))
    html_text
    hemisphere_image_urls = []
    for (x,y) in zip(title,html_text):
        hemisphere_image_urls.append({'title':x,'img_url':y})
    hemisphere_image_urls
    scrapeOutput['hemisphere_image_urls'] = hemisphere_image_urls

    return scrapeOutput

    # In[143]:
