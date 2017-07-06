module.exports = regxMaster;

var mapRegx = {
    str1: /'(?:\\(?:[^']|')|[^'\n\\])*'/, // строка в одерной кавычке
    str2: /"(?:\\(?:[^"]|")|[^"\n\\])*"/, // строка в двойной кавычке
    str3: /`(?:\\(?:[^`]|`)|[^`\\])*`/, // мульти строка
    regx: /\/[^\*\/\n](?:\\\\|\\\/|[^\/\n])+\/[igm]{0,3}/,  // регулярка
    commentAtt: /\/\*\!(?:[^*]|\*(?=[^\/]))*\*\//, // комментарий /*! .... */
    commentSpe: /\/\*\@(?:[^*]|\*(?=[^\/]))*\*\//, // комментарий /*@ .... */
    commentMu: /\/\*(?:\s|[^*]|\*(?=[^\/]))*\*\//, // комментарий /* .... */
    commentMi: /\/\/[^\n]*/, // комментарий
};

mapRegx['js'] = regxMaster(/[\s\}\;]return|[\w\d\)]\/|[:str1:]|[:str2:]|[:commentMu:]|[:commentMi:]|[:regx:]/, {
    str1: true,
    str2: true,
    regx: true,
    commentMu: true,
    commentMi: true
});


mapRegx['css'] = regxMaster(/[:str1:]|[:str2:]|[:commentMu:]|[:commentMi:]/, {
    str1: true,
    str2: true,
    commentMu: true,
    commentMi: true
});


function regxMaster(irgx, conf) {
    conf = conf || false;
    var corx = {};

    return new RegExp(rxCreate(null, irgx.source), ''
        + (irgx.ignoreCase ? 'i' : '')
        + (irgx.multiline ? 'm' : '')
        + (irgx.global ? 'g' : '')
    );

    function rxCreate(name, rgs) {
        var res = rgs.replace(/\[:\w+:\]/g, function(x) {
            var name = x.slice(2, -2), q, r;

            if (q = corx[name]) return q;

            var tmp = conf[name];
            if (tmp === true || typeof tmp === 'string') {
                if (r = mapRegx[typeof tmp === 'string' ? tmp : name]) {
                    return corx[name] = r.source;
                };
                return x;
            };

            return tmp
                ? rxCreate(name, tmp.source)
                : x
                ;
        });

        return name
            ? corx[name] = res
            : res
            ;
    };
};
