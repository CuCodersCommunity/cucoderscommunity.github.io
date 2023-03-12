---
name: "Frame it!"
id: "Frame-it-"
description: "Frame it es una app web que te permite enmarcar y personalizar tus tweets favoritos de forma sencilla pero elegante. Puedes elegir entre varios diseños y opciones de personalización."
logo: "https://raw.githubusercontent.com/mybess00/frame-it/master/public/logo512.png"
email: ""
website: "https://frame-it-app.vercel.app/"
is_open_source: true
repository_url: "https://github.com/mybess00/frame-it"
twitter_username: "frame_it_bot"
telegram_username: ""
dev_username: "mybess00"
pubDate: "Sun Mar 12 2023"
categories: ["toolsAndUtilities","artAndDesign","multimedia"]
platforms: ["Web"]
---

# Frame it!

Frame it is a web application that allows you to frame and customize your favorite tweets in a simple way. You can choose from various layouts and customization options to make your tweets unique. Once you've created your design, you can download your custom tweet as a PNG file and share it on other social networks. Make your tweets stand out with Frame it!

## Available options

### Personalization Options 🎨:
✅ Background of the tweet and photo (includes gradients and solid colors).  
✅ Margins and borders.  
✅ Font size, style and color.  
✅ Size and layout of the tweet images.  
✅ Size of the image that is exported. 

### Pending Updates ⏸:
⌛ Add badges for hashtags (#), links, and usernames.  
⌛ Add support for emojis.  

### Future ideas 💡:
🚀 Telegram bot.  
🚀 Share directly with other social networks.  
🚀 API creation.  
🚀 Multiple font family options.  
🚀 Add support for Twitter threads.  

## Dev information:

### Tech stack 💻:

- React
- Nodejs
- [Tailwindcss](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
- [satori](https://github.com/vercel/satori)

### Other information 📄:

Within the `components/options` folder are functions used for the operation of the app. Within `components/tools` is the configuration of all available customization tools; and inside `components/tweet` you can find the tweet preview components.  

`TweetMockup.js` contains all the HTML elements that are converted to SVG using the satori library.  

[Satori](https://github.com/vercel/satori) is the library of choice used to convert HTML to SVG.  

To obtain the information of the tweets, [vercel-node-twitter](https://github.com/mybess00/vercel-node-twitter) is used.  

Set the url of your Vercel serverless function in the variable `vercelTwitterNode`.  
