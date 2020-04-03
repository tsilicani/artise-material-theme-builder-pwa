export function getRandomString() {
    return Math.random().toString(36).slice(2)
}

export function now() {
    return Math.round(Date.now() / 1000)
}

export function timeAgo(ms) {

    var ago = Math.floor(ms / 1000)
    var part = 0

    if (ago < 2) { return "a moment ago" }
    if (ago < 5) { return "moments ago" }
    if (ago < 60) { return ago + " seconds ago" }

    if (ago < 120) { return "a minute ago" }
    if (ago < 3600) {
        while (ago >= 60) {
            ago -= 60
            part += 1
        }
        return part + " minutes ago"
    }

    if (ago < 7200) { return "an hour ago" }
    if (ago < 86400) {
        while (ago >= 3600) {
            ago -= 3600
            part += 1
        }
        return part + " hours ago"
    }

    if (ago < 172800) { return "a day ago" }
    if (ago < 604800) {
        while (ago >= 172800) {
            ago -= 172800
            part += 1
        }
        return part + " days ago"
    }

    if (ago < 1209600) { return "a week ago" }
    if (ago < 2592000) {
        while (ago >= 604800) {
            ago -= 604800
            part += 1
        }
        return part + " weeks ago"
    }

    if (ago < 5184000) { return "a month ago" }
    if (ago < 31536000) {
        while (ago >= 2592000) {
            ago -= 2592000
            part += 1
        }
        return part + " months ago"
    }

    if (ago < 1419120000) { // 45 years, approximately the epoch
        return "more than year ago"
    }

    // TODO pass in Date.now() and ms to check for 0 as never
    return "never"
}

// export function textTruncate(str, length) {
//     ending = `<span title="${str}">...</span>`
//     if (str.length > length) {
//         return str.substring(0, length) + ending
//     } else {
//         return str
//     }
// }

export function toTitleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

export function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}

// export function readFile(file) {
//   return new Promise((resolve) => {
//     let fr = new FileReader();
//     fr.onload = () => resolve(fr.result);
//     fr.readAsText(file);
// })}

