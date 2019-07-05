// lifted almost verbatim from https://stackoverflow.com/q/46946380/983173

export default function (url, options, timeout = 3000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('fetch request timed out')), timeout)
        )
    ]);
}