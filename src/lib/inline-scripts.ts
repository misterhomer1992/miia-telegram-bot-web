export const themeScript = `(function(){try{var s=localStorage.getItem('miia.theme');var l=window.matchMedia('(prefers-color-scheme: light)').matches;document.documentElement.dataset.theme=s||(l?'light':'dark');}catch(_){}})();`;

export const langRedirectScript = `(function(){try{if(location.pathname===\"/\"){var s=localStorage.getItem('miia.lang');var c=s||(/^uk/i.test(navigator.language||'')?'uk':/^pl/i.test(navigator.language||'')?'pl':'en');if(!s)localStorage.setItem('miia.lang',c);if(c!=='en')location.replace('/'+c);}}catch(_){}})();`;
