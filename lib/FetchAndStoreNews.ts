import axios from "axios";
import { News } from "@/models";
import cron from "node-cron";
import { connectDb } from "@/config/db.config";

async function fetchAndStoreNews() {
  await connectDb();
  try {
    const newsUrl = process.env.NEWS_URL!;
    const response = await axios.get(newsUrl);
    const news = response.data;
    console.log("News fetch cron started");
    
    // clear old news before storing new ones
    if(news.articles.length > 0){
      //if already news delete old news.
    await News.deleteMany({});
    }


    const formattedNews = news.articles.map((article: any) => {
      return {
        author: article.author,
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
      };
    });

    await News.insertMany(formattedNews);
    console.log("News updated successfully");
  } catch (error) {
    console.log("Error occurred in fetching and storing news", error);
  }
}

// Schedule the fetchAndStoreNews function to run every 4 hours
cron.schedule("0 */4 * * *", async () => {
  console.log("Fetching and storing news...");
  await fetchAndStoreNews();
});

export default fetchAndStoreNews;
