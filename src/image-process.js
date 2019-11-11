const mergeImg = require("merge-img");

async function processImage(data) {

    const imagesToMerge = data.map(item => mergeImg(item));

    const images = await Promise.all(imagesToMerge);
    const response = await mergeImg(images, { direction: true });

    const buffer = await new Promise((resolve, reject) =>
        response.blur(1).getBuffer('image/png', (error, buffer) => {
            if (error) reject(error)
            else resolve(buffer)
        })
    );

    return buffer;
}

function proccessBuffer(data) {
    console.log(data);
}

module.exports = processImage;
