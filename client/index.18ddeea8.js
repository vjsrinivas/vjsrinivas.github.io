import{S as t,i as s,s as e,e as l,k as a,t as r,c as n,a as o,m as c,b as h,d as i,f,g as p,h as m,j as u,q as g,l as d,o as v,n as E}from"./client.afbdfe00.js";function b(t,s,e){const l=t.slice();return l[2]=s[e],l[4]=e,l}function j(t,s,e){const l=t.slice();return l[5]=s[e],l}function P(t){let s,e,a;return{c(){s=l("img"),this.h()},l(t){s=n(t,"IMG",{src:!0,alt:!0,class:!0}),this.h()},h(){E(s.src,e=t[2].mediaPath)||f(s,"src",e),f(s,"alt",a="Main image for "+t[2].title),f(s,"class","snapimg svelte-118mnrs")},m(t,e){p(t,s,e)},p(t,l){1&l&&!E(s.src,e=t[2].mediaPath)&&f(s,"src",e),1&l&&a!==(a="Main image for "+t[2].title)&&f(s,"alt",a)},d(t){t&&i(s)}}}function x(t){let s,e,a,c;return{c(){s=l("video"),e=l("source"),c=r("\n\t\t\t\t\t\t\tYour browser does not support the video tag."),this.h()},l(t){s=n(t,"VIDEO",{class:!0});var l=o(s);e=n(l,"SOURCE",{src:!0,type:!0}),c=h(l,"\n\t\t\t\t\t\t\tYour browser does not support the video tag."),l.forEach(i),this.h()},h(){E(e.src,a=t[2].mediaPath)||f(e,"src",a),f(e,"type","video/mp4"),f(s,"class","snapimg svelte-118mnrs"),s.autoplay=!0,s.muted=!0,s.loop=!0},m(t,l){p(t,s,l),m(s,e),m(s,c)},p(t,s){1&s&&!E(e.src,a=t[2].mediaPath)&&f(e,"src",a)},d(t){t&&i(s)}}}function y(t){let s,e,a,c=t[5]+"";return{c(){s=l("span"),e=r(c),this.h()},l(t){s=n(t,"SPAN",{class:!0});var l=o(s);e=h(l,c),l.forEach(i),this.h()},h(){f(s,"class",a="post-tag "+t[5]+" svelte-118mnrs")},m(t,l){p(t,s,l),m(s,e)},p(t,l){1&l&&c!==(c=t[5]+"")&&u(e,c),1&l&&a!==(a="post-tag "+t[5]+" svelte-118mnrs")&&f(s,"class",a)},d(t){t&&i(s)}}}function I(t){let s,e,d,v,E,b,I,V,D,M,O,S,q,w,A,L,R,U,Y,$=t[2].title+"",k=t[2].created+"",B=t[2].author+"",C=t[2].excerpt+"";function G(t,s){return 2&s&&(v=null),null==v&&(v=!("mp4"!=t[1][t[4]].split(".")[1])),v?x:P}let H=G(t,-1),N=H(t),z=t[2].tags,F=[];for(let s=0;s<z.length;s+=1)F[s]=y(j(t,z,s));return{c(){s=l("li"),e=l("a"),d=l("div"),N.c(),E=a(),b=l("div"),I=l("h3"),V=r($),D=a(),M=l("p"),O=r(k),S=r(" - "),q=r(B),w=a();for(let t=0;t<F.length;t+=1)F[t].c();A=a(),L=l("p"),R=r(C),Y=a(),this.h()},l(t){s=n(t,"LI",{class:!0});var l=o(s);e=n(l,"A",{rel:!0,href:!0,class:!0});var a=o(e);d=n(a,"DIV",{class:!0});var r=o(d);N.l(r),E=c(r),b=n(r,"DIV",{class:!0});var f=o(b);I=n(f,"H3",{class:!0});var p=o(I);V=h(p,$),p.forEach(i),D=c(f),M=n(f,"P",{class:!0});var m=o(M);O=h(m,k),S=h(m," - "),q=h(m,B),m.forEach(i),w=c(f);for(let t=0;t<F.length;t+=1)F[t].l(f);A=c(f),L=n(f,"P",{class:!0});var u=o(L);R=h(u,C),u.forEach(i),f.forEach(i),r.forEach(i),a.forEach(i),Y=c(l),l.forEach(i),this.h()},h(){f(I,"class","post svelte-118mnrs"),f(M,"class","recent-sub svelte-118mnrs"),f(L,"class","post svelte-118mnrs"),f(b,"class","snapdiv svelte-118mnrs"),f(d,"class","blog-item svelte-118mnrs"),f(e,"rel","prefetch"),f(e,"href",U="blog/"+t[2].slug),f(e,"class","post svelte-118mnrs"),f(s,"class","svelte-118mnrs")},m(t,l){p(t,s,l),m(s,e),m(e,d),N.m(d,null),m(d,E),m(d,b),m(b,I),m(I,V),m(b,D),m(b,M),m(M,O),m(M,S),m(M,q),m(b,w);for(let t=0;t<F.length;t+=1)F[t]&&F[t].m(b,null);m(b,A),m(b,L),m(L,R),m(s,Y)},p(t,s){if(H===(H=G(t,s))&&N?N.p(t,s):(N.d(1),N=H(t),N&&(N.c(),N.m(d,E))),1&s&&$!==($=t[2].title+"")&&u(V,$),1&s&&k!==(k=t[2].created+"")&&u(O,k),1&s&&B!==(B=t[2].author+"")&&u(q,B),1&s){let e;for(z=t[2].tags,e=0;e<z.length;e+=1){const l=j(t,z,e);F[e]?F[e].p(l,s):(F[e]=y(l),F[e].c(),F[e].m(b,A))}for(;e<F.length;e+=1)F[e].d(1);F.length=z.length}1&s&&C!==(C=t[2].excerpt+"")&&u(R,C),1&s&&U!==(U="blog/"+t[2].slug)&&f(e,"href",U)},d(t){t&&i(s),N.d(),g(F,t)}}}function V(t){let s,e,r=t[0],h=[];for(let s=0;s<r.length;s+=1)h[s]=I(b(t,r,s));return{c(){s=a(),e=l("ul");for(let t=0;t<h.length;t+=1)h[t].c();this.h()},l(t){d("svelte-ojjypt",document.head).forEach(i),s=c(t),e=n(t,"UL",{class:!0});var l=o(e);for(let t=0;t<h.length;t+=1)h[t].l(l);l.forEach(i),this.h()},h(){document.title="Vijay Rajagopal - Blog",f(e,"class","content svelte-118mnrs")},m(t,l){p(t,s,l),p(t,e,l);for(let t=0;t<h.length;t+=1)h[t]&&h[t].m(e,null)},p(t,[s]){if(3&s){let l;for(r=t[0],l=0;l<r.length;l+=1){const a=b(t,r,l);h[l]?h[l].p(a,s):(h[l]=I(a),h[l].c(),h[l].m(e,null))}for(;l<h.length;l+=1)h[l].d(1);h.length=r.length}},i:v,o:v,d(t){t&&i(s),t&&i(e),g(h,t)}}}function D({params:t,query:s}){return this.fetch("blog.json").then(t=>t.json()).then(t=>({posts:t}))}function M(t,s,e){let{posts:l}=s,{filenames:a=[]}=s;for(let t=0;t<l.length;t++){let s=l[t].mediaPath.split("/");a.push(s[s.length-1])}return l=l.filter(t=>-1==t.tags.indexOf("topic")),t.$$set=t=>{"posts"in t&&e(0,l=t.posts),"filenames"in t&&e(1,a=t.filenames)},[l,a]}export default class extends t{constructor(t){super(),s(this,t,M,V,e,{posts:0,filenames:1})}}export{D as preload};