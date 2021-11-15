(this["webpackJsonpcircle-of-suck"]=this["webpackJsonpcircle-of-suck"]||[]).push([[0],{286:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(120),c=n.n(o),i=n(9),u=n(1),l=n.n(u),s=n(121),h=n.n(s),f=n(38),d=n.n(f),m=n(122),p=n(12),g=n.n(p),b=n(60),v=g.a.create({baseURL:"https://raw.githubusercontent.com/brandonchinn178/circle-of-suck"});Object(b.a)({axios:v});var w=n(124),E=n(125),j=function(){function e(t){Object(w.a)(this,e),this.size=void 0,this.adjMatrix=void 0,this.size=t,this.adjMatrix=l.a.map(Array(t),(function(){return l.a.fill(Array(t),null)}))}return Object(E.a)(e,[{key:"addEdge",value:function(e,t,n){if(e>=this.size||t>=this.size)throw new Error("Vertex does not exist");this.adjMatrix[e][t]=n}},{key:"allFrom",value:function(e){if(e>=this.size)throw new Error("Vertex does not exist");return l.a.compact(this.adjMatrix[e].map((function(e,t){return null===e?null:{weight:e,neighbor:t}})))}}]),e}(),k=function(e){var t=function t(n,a){return l.a.flatMap(e.allFrom(n),(function(n){var r=n.neighbor,o=n.weight;return 0===r&&a.nodes.length===e.size?[a]:l.a.includes(a.nodes,r)?[]:t(r,{nodes:l.a.concat(a.nodes,r),weight:a.weight+o})}))}(0,{nodes:[0],weight:0}),n=l.a.minBy(t,"weight");return n?n.nodes:null},y=function(e,t){var n=function(e,t){var n=Object(b.b)({url:"/data/".concat(e,"-").concat(t,".json")});return Object(i.a)(n,1)[0].data}(e,t),r=Object(a.useState)({loading:!0,circleOfSuck:null,teams:null}),o=Object(i.a)(r,2),c=o[0],u=o[1];return Object(a.useEffect)((function(){if(n){var e=n.teams,t=n.games;O(e,t).then((function(t){u({loading:!1,circleOfSuck:t,teams:e})}))}}),[n]),c},O=function(){var e=Object(m.a)(d.a.mark((function e(t,n){var a,r,o,c,u;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=l.a.fromPairs(l.a.map(t,(function(e){return[e.school,[]]}))),r=[],l.a.each(n,(function(e){var t=e.conference_game,n=e.away_team,o=e.home_team,c=e.away_points,i=e.home_points;t&&(null===c||null===i?r.push([o,n]):c>i?a[n].push(o):a[o].push(n))})),o=l.a.fromPairs(l.a.map(t,(function(e,t){return[e.school,t]}))),c=new j(t.length),l.a.each(a,(function(e,t){l.a.each(e,(function(e){c.addEdge(o[t],o[e],0)}))})),l.a.each(r,(function(e){var t=Object(i.a)(e,2),n=t[0],a=t[1];c.addEdge(o[n],o[a],1),c.addEdge(o[a],o[n],1)})),u=k(c)){e.next=10;break}return e.abrupt("return",null);case 10:return e.abrupt("return",l.a.map(u.map((function(e){return t[e]})),(function(e,t,n){var r=n[t===n.length-1?0:t+1];return{from:e,to:r,isPlayed:l.a.includes(a[e.school],r.school)}})));case 11:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),x=new Date,A=x.getFullYear()+(x.getMonth()<6?-1:0),P=function(){var e=Object(a.useState)(A),t=Object(i.a)(e,1)[0];return r.a.createElement("main",null,r.a.createElement("h1",null,"PAC-12 Circle of Suck (",t,")"),r.a.createElement(z,{year:t,conference:"PAC"}))},z=function(e){var t=e.year,n=e.conference,a=y(t,n),o=a.loading,c=a.circleOfSuck,i=a.teams;if(o)return r.a.createElement("p",null,"Loading...");if(null===c)return r.a.createElement("p",null,"No possible circle of suck for this season.");var u=l.a.every(c,"isPlayed");return r.a.createElement(r.a.Fragment,null,!u&&r.a.createElement("p",null,"No complete circle of suck was found. Displaying a possible circle of suck."),r.a.createElement("p",null,"An arrow from school A to school B represents a game where school A beats school B."),!u&&r.a.createElement("p",null,"A dashed arrow from school A to school B represent a future game that could complete the circle of suck, if school A beats school B."),r.a.createElement(h.a,{graph:{nodes:i.map((function(e){var t=e.school,n=e.abbreviation;return{id:t,label:"".concat(t," (").concat(n,")")}})),edges:c.map((function(e){var t=e.from,n=e.to,a=e.isPlayed;return{from:t.school,to:n.school,width:a?2:1,dashes:!a}}))},options:{height:"500px",physics:{enabled:!1}}}))};c.a.render(r.a.createElement(P,null),document.getElementById("root"))}},[[286,1,2]]]);
//# sourceMappingURL=main.56429bfd.chunk.js.map