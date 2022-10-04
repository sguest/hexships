var Le=Object.defineProperty,Oe=Object.defineProperties;var Fe=Object.getOwnPropertyDescriptors;var pe=Object.getOwnPropertySymbols;var Ee=Object.prototype.hasOwnProperty,Re=Object.prototype.propertyIsEnumerable;var ae=(t,e,i)=>e in t?Le(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,b=(t,e)=>{for(var i in e||(e={}))Ee.call(e,i)&&ae(t,i,e[i]);if(pe)for(var i of pe(e))Re.call(e,i)&&ae(t,i,e[i]);return t},x=(t,e)=>Oe(t,Fe(e));var I=(t,e,i)=>(ae(t,typeof e!="symbol"?e+"":e,i),i);import{c as M,j as u,R as ke,a as l,r as f,F as O,l as Ge,b as De,d as $e}from"./vendor.dc3d6da2.js";const Ae=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function i(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerpolicy&&(s.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?s.credentials="include":o.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(o){if(o.ep)return;o.ep=!0;const s=i(o);fetch(o.href,s)}};Ae();var me=(t=>(t[t.positiveX=0]="positiveX",t[t.positiveY=1]="positiveY",t[t.positiveZ=2]="positiveZ",t[t.negativeX=3]="negativeX",t[t.negativeY=4]="negativeY",t[t.negativeZ=5]="negativeZ",t))(me||{});const We={[0]:{x:1,y:0},[1]:{x:0,y:1},[2]:{x:-1,y:1},[3]:{x:-1,y:0},[4]:{x:0,y:-1},[5]:{x:1,y:-1}};function j(t){return We[t]}function ve(){return[0,1,2,3,4,5]}function w(...t){const e={x:0,y:0};for(const i of t)e.x+=i.x,e.y+=i.y;return e}function L(t,e){return{x:t.x*e,y:t.y*e}}function z(t,e){return t.x===e.x&&t.y===e.y}function J(t,e){t.moveTo(e.x,e.y)}function ee(t,e){t.lineTo(e.x,e.y)}const ue=Math.sqrt(3),G=20;function Z(t){return{x:1.5*t.x*G,y:(t.y+.5*t.x)*G*ue}}function Ce(t){const e=Z(t);return[...Array(6).keys()].map(i=>{const n=Math.PI/3*i;return{x:e.x+G*Math.cos(n),y:e.y+G*Math.sin(n)}})}function je(t){return{x:t*3*G,y:t*2*G*ue}}function Ve(t){const e=-t.x-t.y;let i=Math.round(t.x),n=Math.round(t.y);const o=Math.round(e),s=Math.abs(i-t.x),r=Math.abs(n-t.y),c=Math.abs(o-e);return s>r&&s>c?i=-n-o:r>c&&(n=-i-o),{x:i,y:n}}function Xe(t){return Ve({x:t.x*2/3/G,y:(t.x*-1/3+t.y*ue/3)/G})}function B(t,e){const i=-t.x-t.y;return t.x>-e&&t.x<e&&t.y>-e&&t.y<e&&i>-e&&i<e}function Ye(t){const e=[];for(let i=-t+1;i<t;i++)for(let n=-t+1;n<t;n++)B({x:i,y:n},t)&&e.push({x:i,y:n});return e}function qe(t,e){return ve().map(i=>{const n=j(i);return w(t,n)}).filter(i=>B(i,e))}function q(t){const e=j(t.facing);let i={x:t.x,y:t.y};const n=[{x:t.x,y:t.y}];for(let o=1;o<t.size;o++)i=w(i,e),n.push(i);return n}function we(t,e,i){const n=q(t),o=e.map(s=>q(s)).flat();for(const s of n){if(!B(s,i))return!1;for(const r of o)if(z(s,r))return!1}return!0}function ge(t,e){for(let i=0;i<t.length;i++)if(!we(t[i],t.slice(i+1),e))return!1;return!0}var R=(t=>(t[t.Hit=0]="Hit",t[t.Miss=1]="Miss",t))(R||{});function ze(t){return t.filter(e=>e.hits===e.size)}function fe(t,e){return t.shotPerShip?e.ownShips.length-ze(e.ownShips).length:t.shots}class Ze{constructor(e,i){I(this,"players");I(this,"activePlayerId");this.gameSettings=e,this.subscriber=i,this.players=[{ships:[],mines:[],markers:[],active:!0},{ships:[],mines:[],markers:[],active:!0}],this.activePlayerId=0}getLocalState(e){const i=+!e,n=this.playerLost(i),o=this.playerLost(e),s=o||n;return{ownShips:this.players[e].ships,ownMarkers:this.players[e].markers,ownMines:this.players[e].mines,opponentShips:s?this.players[i].ships:void 0,opponentMarkers:this.players[i].markers,opponentMines:this.players[i].mines.filter(r=>s||this.players[e].markers.some(c=>z(r,c))),isOwnTurn:e===this.activePlayerId&&!!this.players[e].ships.length,sunkEnemies:ze(this.players[i].ships).map(r=>r.definitionId),gameWon:n,gameLost:o,opponentShipsPlaced:!!this.players[i].ships.length,opponentLeft:!this.players[i].active}}playerLost(e){const i=this.players[e];return!i.active||!!i.ships.length&&i.ships.every(n=>n.hits===n.size)}validateShipPlacement(e){const i=this.gameSettings.ships.slice(0),n=[];for(const o of e){const s=i.findIndex(c=>c.id===o.definitionId);if(s===-1)return[];const r=i[s];n.push({x:o.x,y:o.y,size:r.size,facing:o.facing,hits:0,name:r.name,definitionId:o.definitionId}),i.splice(s,1)}return i.length?[]:ge(n,this.gameSettings.gridSize)?n:[]}validateMinePlacement(e,i){if(e.length!==this.gameSettings.mines)return!1;const n=i.map(o=>q(o)).flat();for(const o of e)if(n.some(s=>z(s,o))||e.some(s=>s!==o&&z(o,s))||!B(o,this.gameSettings.gridSize))return!1;return!0}setFleet(e,i){if(!this.players[e])return;const n=this.validateShipPlacement(i.ships);n.length&&this.validateMinePlacement(i.mines,n)?(this.players[e].ships=n,this.players[e].mines=i.mines.slice(),this.allShipsPlaced()?this.broadcastState():this.sendState(e)):this.sendState(e)}tryHit(e,i){for(const n of e)for(const o of q(n))if(z(o,i))return n.hits++,!0;return!1}fireShots(e,i){const n=this.players[e],o=this.getLocalState(e),s=+!e;if(this.activePlayerId===e&&!this.playerLost(e)&&!this.playerLost(s)&&this.allShipsPlaced()&&i.length===fe(this.gameSettings,o)&&i.every(c=>!!c&&B(c,this.gameSettings.gridSize)&&!n.markers.some(a=>z(a,c))&&!i.some(a=>a!==c&&z(c,a)))){let c=!1;for(const a of i){const h=this.tryHit(this.players[s].ships,a);if(n.markers.push({x:a.x,y:a.y,type:h?R.Hit:R.Miss}),c=c||h,this.players[s].mines.some(m=>z(m,a)))for(const m of[...qe(a,this.gameSettings.gridSize),a])this.players[s].markers.some(g=>z(g,m))||this.players[s].markers.push({x:m.x,y:m.y,type:this.tryHit(this.players[e].ships,m)?R.Hit:R.Miss})}(!this.gameSettings.streak||!c)&&(this.activePlayerId=s),this.broadcastState()}else this.sendState(e)}leaveGame(e){const i=+!e;!this.playerLost(e)&&!this.playerLost(i)&&(this.players[e].active=!1,this.broadcastState())}sendState(e){this.subscriber(e,this.getLocalState(e))}broadcastState(){for(let e=0;e<this.players.length;e++)this.sendState(e)}allShipsPlaced(){return this.players.every(e=>e.ships.length)}}function X(t,e){return Math.floor(Math.random()*(e-t+1))+t}function _e(t){const e=Object.keys(t).map(o=>Number.parseInt(o)).filter(o=>!Number.isNaN(o)),i=Math.floor(Math.random()*e.length);return e[i]}class Qe{constructor(e){I(this,"ownShots",[]);I(this,"ownShotCount",0);I(this,"priorityHits",[]);I(this,"trackedHits",[]);I(this,"sunkShips",[]);this.gameSettings=e}generateFleet(){const e=[],i=-this.gameSettings.gridSize,n=-this.gameSettings.gridSize,o=this.gameSettings.gridSize,s=this.gameSettings.gridSize;for(const a of this.gameSettings.ships){let h;do h={size:a.size,name:a.name,x:X(i,o),y:X(n,s),facing:_e(me),hits:0,definitionId:a.id};while(!ge([...e,h],this.gameSettings.gridSize));e.push(h)}const r=[],c=e.map(q).flat();for(let a=0;a<this.gameSettings.mines;a++){let h;do h={x:X(i,o),y:X(n,s)};while(!B(h,this.gameSettings.gridSize)||r.some(m=>z(m,h)||c.some(g=>z(g,h))));r.push(h)}return{ships:e,mines:r}}updateState(e){var i,n;if(!!((i=e.ownMarkers)==null?void 0:i.length))for(;e.ownMarkers.length>this.ownShotCount;){const o=e.ownMarkers[this.ownShotCount];if(this.ownShots[o.x]=this.ownShots[o.x]||[],this.ownShots[o.x][o.y]===void 0&&(this.ownShots[o.x][o.y]=o.type,o.type===R.Hit)){if(e.sunkEnemies.length===this.sunkShips.length)this.priorityHits.push(o),this.trackedHits.push(o);else for(const s of e.sunkEnemies)if(this.sunkShips.indexOf(s)===-1){this.sunkShips.push(s);const r=(n=this.gameSettings.ships.find(c=>c.id===s))==null?void 0:n.size;if(r){let c=!1;for(let a=0;a<6;a++)if(!c){const h=j(a);let m=o;const g=[m];for(let d=0;d<r;d++)m=w(m,h),this.trackedHits.find(k=>z(k,m))&&g.push(m);if(g.length===r){c=!0;for(const d of g){let y=this.trackedHits.findIndex(k=>z(k,d));y!==-1&&this.trackedHits.splice(y,1),y=this.priorityHits.findIndex(k=>z(k,d)),y!==-1&&this.priorityHits.splice(y,1)}}}}}}this.ownShotCount++}}getShots(e){const i=[];for(;this.priorityHits.length;){const r=this.priorityHits[0],c=ve();for(;c.length;){const h=c.splice(X(0,c.length-1),1)[0];let m=j(h);const g=w(r,m);let d=r;if(this.trackedHits.find(y=>z(y,g))){for(;this.getOwnShot(d)===R.Hit&&B(d,this.gameSettings.gridSize);)d=w(d,m);for(;this.getOwnShot(d)===void 0&&B(d,this.gameSettings.gridSize);)i.push(d),d=w(d,m);for(d=r,m=j((h+3)%6);this.getOwnShot(d)===R.Hit&&B(d,this.gameSettings.gridSize);)d=w(d,m);for(;this.getOwnShot(d)===void 0&&B(d,this.gameSettings.gridSize);)i.push(d),d=w(d,m)}}if(i.length>=e)return i.slice(0,e);const a=[];for(let h=0;h<6;h++){const m=j(h),g=w(r,m);this.getOwnShot(g)===void 0&&B(g,this.gameSettings.gridSize)&&a.push(g)}for(;a.length;)i.push(a.splice(X(0,a.length-1),1)[0]);if(i.length>=e)return i.slice(0,e);this.priorityHits.splice(0,1)}const n=this.gameSettings.ships.filter(r=>!this.sunkShips.some(c=>r.id===c)),o=Math.min(...n.map(r=>r.size)),s=[];for(let r=-this.gameSettings.gridSize;r<=this.gameSettings.gridSize;r++)for(let c=-this.gameSettings.gridSize;c<=this.gameSettings.gridSize;c++){const a={x:r,y:c};if(B(a,this.gameSettings.gridSize)&&this.getOwnShot(a)===void 0)for(let h=0;h<3;h++){const m=j(h);let g=!0;const d=[a];let y=a;for(let k=1;k<o;k++){y=w(y,m);const F=this.getOwnShot(y);!B(y,this.gameSettings.gridSize)||F===R.Miss?g=!1:F===void 0&&d.push(y)}g&&s.push(...d)}}for(;i.length<e;)i.push(s.splice(X(0,s.length-1),1)[0]);return i}getOwnShot(e){return this.ownShots[e.x]&&this.ownShots[e.x][e.y]}}const re=0,be=1;class Ke{constructor(e){I(this,"stateSubscriptions");I(this,"gameManager");I(this,"aiPlayer");this.gameSettings=e,this.stateSubscriptions=[],this.gameManager=new Ze(e,(i,n)=>this.sendState(i,n)),this.aiPlayer=new Qe(e)}onStateChange(e){this.stateSubscriptions.push(e)}offStateChange(e){const i=this.stateSubscriptions.indexOf(e);i>=0&&this.stateSubscriptions.splice(i,1)}setFleet(e){this.gameManager.setFleet(re,e),this.gameManager.setFleet(be,this.aiPlayer.generateFleet())}fireShots(e){this.gameManager.fireShots(re,e)}leaveGame(){}getSettings(){return this.gameSettings}sendState(e,i){e===re?this.stateSubscriptions.forEach(n=>n(i)):(this.aiPlayer.updateState(i),i.isOwnTurn&&!i.gameLost&&!i.gameWon&&setTimeout(()=>{this.takeEnemyShot(i)},1e3))}takeEnemyShot(e){this.gameManager.fireShots(be,this.aiPlayer.getShots(fe(this.gameSettings,e)))}}class Ue{constructor(e,i){I(this,"stateSubscriptions");this.socket=e,this.gameSettings=i,this.stateSubscriptions=[],this.socket.on("update-state",n=>{this.stateSubscriptions.forEach(o=>o(n))})}onStateChange(e){this.stateSubscriptions.push(e)}offStateChange(e){const i=this.stateSubscriptions.indexOf(e);i>=0&&this.stateSubscriptions.splice(i,1)}setFleet(e){this.socket.emit("set-fleet",e)}fireShots(e){this.socket.emit("fire-shots",e)}leaveGame(){this.socket.emit("leave-game")}getSettings(){return this.gameSettings}}function Ne(t){var e,i;if(!t.shotPerShip&&t.shots<1||t.mines<0||!((e=t.ships)==null?void 0:e.length))return!1;for(const n of t.ships)if(!((i=n.name)==null?void 0:i.trim())||n.size<1)return!1;return!0}const K={ships:[{id:1,size:2,name:"Patrol Boat"},{id:2,size:3,name:"Destroyer"},{id:3,size:3,name:"Submarine"},{id:4,size:4,name:"Battleship"},{id:5,size:5,name:"Aircraft Carrier"}],gridSize:7,streak:!1,shots:1,shotPerShip:!1,mines:0};var Y=(t=>(t[t.Basic=0]="Basic",t[t.Streak=1]="Streak",t[t.Barrage=2]="Barrage",t[t.Salvo=3]="Salvo",t[t.Minefield=4]="Minefield",t[t.Custom=5]="Custom",t))(Y||{});const te={title:"Basic",id:0,description:"Basic rules with no modifications",settings:K},Je={title:"Streak",id:1,description:"Fire again after landing a hit",settings:x(b({},K),{streak:!0})},et={title:"Barrage",id:2,description:"Fire 4 shots each turn",settings:x(b({},K),{shots:4})},tt={title:"Salvo",id:3,description:"Fire 1 shot for each surviving ship",settings:x(b({},K),{shotPerShip:!0})},it={title:"Minefield",id:4,description:"Place 5 mines that explode when hit by the enemy, damaging enemy ships",settings:x(b({},K),{mines:5})},Me={title:"Custom",id:5,description:"Custom settings"},Te={[0]:te,[1]:Je,[2]:et,[3]:tt,[4]:it,[5]:Me};function ce(t){return Te[t]}function Pe(){return Object.values(Te).filter(t=>!!t.settings)}const C="#ccc",_=["Big Shoulders Stencil Text","sans-serif"],Q={fontSize:"1.2rem",border:"2px solid black",padding:{top:4,bottom:4,left:10,right:10},cursor:"pointer",color:C,backgroundColor:"#333","&:hover":{backgroundColor:"#555"},"&:disabled":{cursor:"default",backgroundColor:"#999"}},he={border:`1px solid ${C}`,background:"transparent",color:C,padding:3,fontSize:"1rem","& option":{backgroundColor:"#022866"},"&:disabled":{backgroundColor:"#ccc",color:"#666"}},xe={fontSize:"1.6rem",border:"2px solid black",padding:{top:4,bottom:4,left:10,right:10},cursor:"pointer"},nt=M({buttonContainer:{display:"flex",justifyContent:"space-between"},okButton:x(b({},xe),{"&:hover":{backgroundColor:"white"}}),cancelButton:x(b({},xe),{color:C,backgroundColor:"#333","&:hover":{backgroundColor:"#555"}})}),st={content:{border:"3px solid #ccc",display:"inline-block",background:"#333",color:"white",top:"50%",left:"50%",transform:"translate(-50%, -50%)",padding:20,fontSize:"1.5rem",fontFamily:"sans-serif",inset:"50% auto auto 50%"},overlay:{zIndex:999}};function Be(t){const e=nt(),i=()=>{t.onClose(),t.onOk&&t.onOk()};return u(ke,{isOpen:!0,onRequestClose:t.onClose,style:st,children:[l("p",{children:t.children}),u("div",{className:e.buttonContainer,children:[t.okButton&&l("button",{className:e.okButton,onClick:i,children:"OK"}),t.cancelButton&&l("button",{className:e.cancelButton,onClick:t.onClose,children:"Cancel"})]})]})}const ot=M({tooltip:{fontSize:"1.5rem",cursor:"pointer",marginLeft:"20px",color:"#cfc",border:"none",background:"transparent"}});function Se(t){const e=ot(),[i,n]=f.exports.useState(!1);return u(O,{children:[i&&l(Be,{okButton:!0,onClose:()=>n(!1),children:t.children}),l("button",{className:e.tooltip,onClick:()=>n(!0),type:"button",children:"(?)"})]})}const at=M({menu:{margin:0,padding:{left:20},listStyleType:"none"},menuButton:{background:"transparent",border:"none",fontFamily:_,color:C,fontSize:"1.5rem",cursor:"pointer","&:hover":{color:"#fff"}}});function rt(t){const e=at();return l("ul",{className:e.menu,children:t.items.filter(i=>i.condition===void 0||i.condition).map(i=>u("li",{children:[l("button",{className:e.menuButton,onClick:i.onClick,children:i.text}),i.tooltip&&l(Se,{children:i.tooltip})]},i.text))})}const lt=M({label:{color:C,fontSize:"1.1rem",fontFamily:"sans-serif",display:"flex",justifyContent:"space-between",alignItems:"flex-start",margin:{bottom:15}},input:x(b({},he),{width:200,boxSizing:"border-box",maxWidth:"100%",flexShrink:0}),checkbox:{width:20,height:20},addButton:{background:"transparent",border:"none",color:"green",fontSize:"1.5rem",cursor:"pointer",display:"block",marginBottom:10},deleteButton:{background:"transparent",border:"none",color:"red",fontSize:"1.1rem",cursor:"pointer"},shipsHeader:{color:C,fontSize:"1.4rem",fontFamily:"sans-serif"},shipList:{listStyleType:"none",padding:0,margin:0,color:C,fontFamily:"sans-serif",fontSize:"1.1rem","& li":{display:"flex",justifyContent:"space-between",flexWrap:"wrap"},"& input":he},sizeInput:{maxWidth:100},nameInput:{marginRight:20}});function He(t){const e=lt(),i=s=>{const r=t.settings.ships.findIndex(a=>a.id===s.id),c=t.settings.ships.slice();c[r]=s,t.onSettingsChanged(x(b({},t.settings),{ships:c}))},n=()=>{t.onSettingsChanged(x(b({},t.settings),{ships:[...t.settings.ships,{id:Math.max(...t.settings.ships.map(s=>s.id))+1,name:"",size:2}]}))},o=s=>{const r=t.settings.ships.slice();r.splice(r.findIndex(c=>c.id===s),1),t.onSettingsChanged(x(b({},t.settings),{ships:r}))};return u(O,{children:[u("label",{className:e.label,children:["Number of shots per turn",l("input",{className:e.input,type:"number",min:"1",value:t.settings.shots,onChange:s=>t.onSettingsChanged(x(b({},t.settings),{shots:parseInt(s.target.value)})),disabled:t.settings.shotPerShip})]}),u("label",{className:e.label,children:["One shot per remaining ship",l("input",{className:e.checkbox,type:"checkbox",checked:t.settings.shotPerShip,onChange:s=>t.onSettingsChanged(x(b({},t.settings),{shotPerShip:s.target.checked}))})]}),u("label",{className:e.label,children:["Fire again on hit",l("input",{className:e.checkbox,type:"checkbox",checked:t.settings.streak,onChange:s=>t.onSettingsChanged(x(b({},t.settings),{streak:s.target.checked}))})]}),u("label",{className:e.label,children:["Number of mines",l("input",{className:e.input,type:"number",min:"0",value:t.settings.mines,onChange:s=>t.onSettingsChanged(x(b({},t.settings),{mines:parseInt(s.target.value)}))})]}),l("p",{className:e.shipsHeader,children:"Ships"}),l("ul",{className:e.shipList,children:t.settings.ships.map(s=>u("li",{children:[u("label",{children:["Name ",l("input",{className:e.nameInput,type:"text",value:s.name,onChange:r=>i(x(b({},s),{name:r.target.value}))})]}),u("label",{children:["Size ",l("input",{className:e.sizeInput,type:"number",value:s.size,min:1,onChange:r=>i(x(b({},s),{size:parseInt(r.target.value)}))})]}),l("button",{className:e.deleteButton,type:"button",onClick:()=>o(s.id),children:"X"})]},s.id))}),l("button",{className:e.addButton,type:"button",onClick:n,children:"+"})]})}const ct=M({form:{padding:{left:20,right:20},maxWidth:500},label:{color:C,fontSize:"1.1rem",fontFamily:"sans-serif",display:"flex",justifyContent:"space-between",alignItems:"flex-start",margin:{bottom:15}},input:x(b({},he),{width:200,boxSizing:"border-box",maxWidth:"100%",flexShrink:0}),button:x(b({},Q),{"&:first-of-type":{marginRight:20}})});function ht(t){const e=ct(),[i,n]=f.exports.useState(Y.Basic),[o,s]=f.exports.useState(te.settings),[r,c]=f.exports.useState(""),a=()=>{t.onCreated(r,i,o)};let h=!0;return r.trim()||(h=!1),i===Y.Custom&&!Ne(o)&&(h=!1),u("form",{className:e.form,children:[u("label",{className:e.label,children:["Game Name",l("input",{className:e.input,type:"text",value:r,onChange:m=>c(m.target.value)})]}),u("label",{className:e.label,children:["Game Mode",l(Se,{children:ce(i).description}),l("select",{className:e.input,value:i,onChange:m=>n(parseInt(m.target.value)),"data-testid":"gamemode",children:[...Pe(),Me].map(m=>l("option",{value:m.id,children:m.title},m.id))})]}),i===Y.Custom&&l(O,{children:l(He,{onSettingsChanged:s,settings:o})}),l("button",{className:e.button,onClick:a,disabled:!h,type:"button",children:"Create"}),l("button",{className:e.button,onClick:()=>t.onCancel(),type:"button",children:"Cancel"})]})}const dt=M({item:{fontSize:"1rem",margin:{top:4,bottom:4}}});function mt(t){const e=dt(),i=(o,s)=>o.name===s.name&&o.size===s.size,n=t.settings.ships.length===5&&t.settings.ships.every((o,s)=>i(o,te.settings.ships[s]));return u(O,{children:[l("p",{className:e.item,children:"Differences from basic rules:"}),t.settings.shotPerShip&&l("p",{className:e.item,children:"1 shot per surviving ship"}),!t.settings.shotPerShip&&t.settings.shots>1&&u("p",{className:e.item,children:[t.settings.shots," shots per turn"]}),t.settings.streak&&l("p",{className:e.item,children:"Fire again after a hit"}),t.settings.mines>0&&u("p",{className:e.item,children:[t.settings.mines," mines"]}),!n&&u("p",{className:e.item,children:["Ships",l("ul",{children:t.settings.ships.map(o=>u("li",{children:[o.name," (size ",o.size,")"]},o.id))})]})]})}const ut=M({button:Q,noGamesMessage:{color:C,size:"2rem",fontFamily:"sans-serif",marginLeft:20},list:{listStyle:"none",padding:0,margin:20},game:{border:`1px solid ${C}`,padding:15,width:"100%",maxWidth:400,marginBottom:10},info:{margin:{top:0,bottom:5},color:C,fontSize:"1.2rem",fontFamily:"sans-serif"}});function gt(t){var i;const e=ut();return u(O,{children:[!t.games&&l("p",{className:e.noGamesMessage,children:"Loading game list..."}),!!t.games&&!t.games.length&&l("p",{className:e.noGamesMessage,children:"No games found"}),!!((i=t.games)==null?void 0:i.length)&&l("ul",{className:e.list,children:!!t.games&&t.games.map(n=>u("li",{className:e.game,children:[u("p",{className:e.info,children:["Name: ",n.definition.name]}),u("p",{className:e.info,children:["Mode: ",ce(n.definition.mode).title,l(Se,{children:n.definition.mode===Y.Custom?l(mt,{settings:n.definition.settings}):ce(n.definition.mode).description})]}),l("button",{className:e.button,onClick:()=>t.onSelected(n),children:"Join"})]},n.id))})]})}const ft=M({heading:{fontFamily:_,color:C,fontSize:"3rem",margin:0,padding:{top:10,bottom:10,left:20}},statusText:{fontFamily:_,color:C,fontSize:"1.5rem",padding:{left:20}},buttonStyle:x(b({},Q),{margin:{left:20}}),singlePlayerCustom:{padding:{left:20,right:20},maxWidth:500},playButton:Q});function St(t){const e=ft(),[i,n]=f.exports.useState(0),[o,s]=f.exports.useState(void 0),[r,c]=f.exports.useState(te.settings),{socket:a,onNewGame:h}=t;f.exports.useEffect(()=>(a==null||a.on("join-game",S=>{h(new Ue(a,S))}),()=>{a==null||a.removeAllListeners("join-game")}),[h,a]),f.exports.useEffect(()=>(a==null||a.on("add-lobby-game",S=>{o?o.findIndex(T=>T.id===S.id)===-1&&s([...o,S]):s([S])}),a==null||a.on("remove-lobby-game",S=>{if(o){const T=o.findIndex(E=>E.id===S);if(T>=0){const E=o.slice();E.splice(T),s(E)}}}),()=>{a==null||a.removeAllListeners("add-lobby-game"),a==null||a.removeAllListeners("remove-lobby-game")}),[a,o]);const m=S=>{n(5),a==null||a.emit("quick-connect",S)},g=()=>{a==null||a.emit("cancel-quick-connect"),n(4)},d=(S,T,E)=>{T===Y.Custom?E&&(n(7),a==null||a.emit("add-custom-lobby-game",S,E)):(n(7),a==null||a.emit("add-standard-lobby-game",S,T))},y=()=>{a==null||a.emit("remove-lobby-game"),n(3)},k=()=>{a==null||a.emit("enter-lobby",S=>{s(S)}),n(8)},F=S=>{a==null||a.emit("join-lobby-game",S.id)},D=S=>{t.onNewGame(new Ke(S))},W=S=>Pe().map(T=>({text:T.title,onClick:()=>S(T),tooltip:T.description}));let H=[];return i===0?H=[{text:"Versus AI",onClick:()=>n(1)},{text:"Multiplayer",onClick:()=>n(3),condition:t.isConnected}]:i===1?H=[...W(S=>D(S.settings)),{text:"Custom",onClick:()=>n(2)},{text:"Back",onClick:()=>n(0)}]:i===3?H=[{text:"Quick Match",onClick:()=>n(4)},{text:"Create Game",onClick:()=>n(6)},{text:"Find Game",onClick:k},{text:"Back",onClick:()=>n(0)}]:i===4&&(H=[...W(S=>m(S.id)),{text:"Back",onClick:()=>n(3)}]),u(O,{children:[l("h1",{className:e.heading,children:"Hexships"}),!!H.length&&l(rt,{items:H}),i===2&&u("form",{className:e.singlePlayerCustom,children:[l(He,{onSettingsChanged:c,settings:r}),l("button",{className:e.playButton,onClick:()=>r&&D(r),disabled:!Ne(r),type:"button",children:"Play"}),l("button",{className:e.buttonStyle,onClick:()=>n(1),type:"button",children:"Cancel"})]}),i===5&&u(O,{children:[l("p",{className:e.statusText,children:"Searching for opponent..."}),l("button",{className:e.buttonStyle,onClick:g,children:"Cancel"})]}),i===6&&l(ht,{onCreated:d,onCancel:()=>n(3)}),i===7&&u(O,{children:[l("p",{className:e.statusText,children:"Waiting for opponent..."}),l("button",{className:e.buttonStyle,onClick:y,children:"Cancel"})]}),i===8&&u(O,{children:[l("button",{className:e.buttonStyle,onClick:()=>n(3),children:"Back"}),l(gt,{games:o,onSelected:S=>F(S)})]})]})}function ie(t,e,i){const n=t.current;if(!n)return;const o=n.getContext("2d");!o||(o.setTransform(1,0,0,1,0,0),o.clearRect(0,0,n.width,n.height),o.scale(e,e),i(o))}const yt=M({"@keyframes boardGradient":{from:{backgroundPosition:"0% 50%"},to:{backgroundPosition:"100% 50%"}},canvas:{animationName:"$boardGradient",animationDuration:"20s",animationIterationCount:"infinite",animationTimingFunction:"ease",animationDirection:"alternate",position:"absolute",zIndex:1,pointerEvents:"none",background:"linear-gradient(80deg, #00545c 0%, #00405c 30%, #00545c 60%, #00405c 90%)",backgroundSize:"400% 400%",border:"5px solid #242f40",boxSizing:"border-box"}});function pt(t){const e=f.exports.useRef(null),i=yt();return f.exports.useEffect(()=>{ie(e,t.uiScale,n=>{n.strokeStyle="black",n.beginPath();const o=Ye(t.gridSize);for(const s of o){const r=Ce(s);J(n,w(r[5],L(t.gridDimensions,.5)));for(const c of r)ee(n,w(c,L(t.gridDimensions,.5)))}n.stroke()})},[t.gridSize,e,t.uiScale,t.gridDimensions]),l("canvas",{ref:e,width:t.gridDimensions.x*t.uiScale,height:t.gridDimensions.y*t.uiScale,className:i.canvas,"data-testid":"field-canvas"})}const bt=M({canvas:{position:"absolute",zIndex:3,pointerEvents:"none",border:"5px solid transparent",boxSizing:"border-box"}});function xt(t){const e=f.exports.useRef(null),i=bt();return f.exports.useEffect(()=>{ie(e,t.uiScale,n=>{var o;n.strokeStyle="grey",n.lineWidth=G,n.lineCap="round",n.beginPath();for(const s of t.ships){const r=Z(s),c=j(s.facing),a=w(s,L(c,s.size-1)),h=Z(a);J(n,w(r,L(t.gridDimensions,.5))),ee(n,w(h,L(t.gridDimensions,.5)))}if(n.stroke(),(o=t.mines)==null?void 0:o.length){n.strokeStyle="black",n.fillStyle="black",n.lineWidth=1,n.lineCap="butt",n.beginPath();const s=16,r=Math.PI*2/s;for(const c of t.mines){const a=Z(c),h=[];for(let m=0;m<s;m++){const g=m*r,d=G*(m%2?.3:.8);h.push(w(a,{x:Math.cos(g)*d,y:Math.sin(g)*d},L(t.gridDimensions,.5)))}J(n,h[s-1]);for(const m of h)ee(n,m)}n.fill()}})},[t.ships,t.mines,e,t.uiScale,t.gridDimensions]),l("canvas",{ref:e,width:t.gridDimensions.x*t.uiScale,height:t.gridDimensions.y*t.uiScale,className:i.canvas,"data-testid":"ships-canvas"})}const kt=M({canvas:{position:"absolute",zIndex:4,pointerEvents:"none",border:"5px solid transparent",boxSizing:"border-box"}});function vt(t){const e=f.exports.useRef(null),i=kt();return f.exports.useEffect(()=>{ie(e,t.uiScale,n=>{n.strokeStyle="black";for(const o of t.markers){n.fillStyle=o.type===R.Hit?"red":"white",n.beginPath();const s=w(Z(o),L(t.gridDimensions,.5));n.arc(s.x,s.y,G*.4,0,Math.PI*2),n.stroke(),n.fill()}})},[t.markers,e,t.uiScale,t.gridDimensions]),l("canvas",{ref:e,width:t.gridDimensions.x*t.uiScale,height:t.gridDimensions.y*t.uiScale,className:i.canvas,"data-testid":"marker-canvas"})}const Ct=M({canvas:{position:"absolute",zIndex:2,border:"5px solid transparent",boxSizing:"border-box"}});function wt(t){const e=f.exports.useRef(null),[i,n]=f.exports.useState(null),[o,s]=f.exports.useState(void 0),r=Ct();f.exports.useEffect(()=>{ie(e,t.uiScale,g=>{const d=(y,k)=>{const F=Ce(y);g.fillStyle=k,g.beginPath(),J(g,w(F[5],L(t.gridDimensions,.5)));for(const D of F)ee(g,w(D,L(t.gridDimensions,.5)));g.fill()};if(t.overlayStyle&&(e==null?void 0:e.current)&&(g.fillStyle=t.overlayStyle,g.fillRect(0,0,999999,999999)),i&&o&&d(i,o),t.highlightTiles)for(const y of t.highlightTiles)d(y,y.style)})},[e,t.highlightTiles,i,o,t.uiScale,t.gridDimensions,t.overlayStyle]);const c=g=>{const d=g.target.getBoundingClientRect(),y=w(L({x:g.clientX,y:g.clientY},1/t.uiScale),L(t.gridDimensions,-.5),L(d,-1/t.uiScale));return Xe(y)},a=g=>{const d=c(g);B(d,t.gridSize)&&t.onSelectTile&&t.onSelectTile(d)},h=g=>{const d=c(g);n(B(d,t.gridSize)?d:null),s(t.mouseHighlightStyle?t.mouseHighlightStyle(d):void 0)},m=()=>{n(null)};return l("canvas",{ref:e,width:t.gridDimensions.x*t.uiScale,height:t.gridDimensions.y*t.uiScale,className:r.canvas,onClick:a,onMouseMove:h,onMouseLeave:m,"data-testid":"interaction-canvas"})}const zt=M({board:{position:"relative",width:"100%",maxHeight:"100%",aspectRatio:.86,overflow:"hidden","@media (max-width: 640px)":{maxWidth:"100%",height:"100%"},gridArea:t=>t.gridArea}});function de(t){var r,c;const e=f.exports.useRef(null),[i,n]=f.exports.useState(0),o=zt(t);f.exports.useEffect(()=>{const a=()=>{var h,m;n(Math.min((((h=e==null?void 0:e.current)==null?void 0:h.clientWidth)||0)/420,(((m=e==null?void 0:e.current)==null?void 0:m.clientHeight)||0)/500))};return window.addEventListener("resize",a),a(),()=>{window.removeEventListener("resize",a)}},[e]);const s=je(t.gridSize);return u("div",{className:o.board,ref:e,children:[l(pt,{gridSize:t.gridSize,uiScale:i,gridDimensions:s}),(!!((r=t.highlightTiles)==null?void 0:r.length)||t.onSelectTile||t.mouseHighlightStyle)&&l(wt,{gridSize:t.gridSize,onSelectTile:t.onSelectTile,highlightTiles:t.highlightTiles,mouseHighlightStyle:t.mouseHighlightStyle,uiScale:i,gridDimensions:s,overlayStyle:t.overlayStyle}),!!(t.ships||t.mines)&&l(xt,{ships:t.ships||[],mines:t.mines||[],uiScale:i,gridDimensions:s}),!!((c=t.markers)==null?void 0:c.length)&&l(vt,{markers:t.markers,uiScale:i,gridDimensions:s})]})}const le=640,Nt=M({container:{display:"inline-block",[`@media (max-width: ${le}px)`]:{width:"100%"}},panel:{margin:0,padding:0,listStyleType:"none",width:"100%"},shipList:{display:"grid",gridTemplateRows:"repeat(6, 1fr)",[`@media (max-width: ${le}px)`]:{gridTemplateRows:"repeat(2, 1fr)",gridTemplateColumns:"repeat(3, 1fr)"}},ship:{border:"2px solid black",background:"transparent",color:C,cursor:"pointer",textAlign:"left",boxSizing:"border-box",margin:{bottom:5},padding:{left:10,right:10,top:5,bottom:5},"@media (max-width: 560px)":{padding:{left:4,right:4,top:2,bottom:2}},"& div":{fontSize:"1.5rem","@media (max-width: 560px)":{fontSize:"1.1rem"}},"& span":{fontSize:"1rem",display:"inline-block","@media (max-width: 560px)":{fontSize:"0.8rem"}}},selectedShip:{backgroundColor:"#0050d4"},mines:{color:C,fontSize:"1.5rem",fontFamily:"sans-serif"},placedShip:{borderColor:C},actionContainer:{display:"flex",justifyContent:"space-between"},actionButton:x(b({},Q),{[`@media (max-width: ${le}px)`]:{alignSelf:"stretch",fontSize:"1rem"}})});function Mt(t){const e=Nt();return u("div",{className:e.container,children:[t.mines===void 0?l("div",{className:e.shipList,children:t.ships.map(i=>u("button",{onClick:()=>t.onSelected(i.id),className:`${e.ship} ${i.id===t.selectedId?e.selectedShip:""} ${t.placedIds.indexOf(i.id)===-1?"":e.placedShip}`,children:[l("div",{children:i.name}),u("span",{children:["Size: ",i.size]})]},i.id))}):u("p",{className:e.mines,children:[t.mines," Mine",t.mines===1?"":"s"," remaining"]}),u("div",{className:e.actionContainer,children:[t.mines===void 0&&l("button",{className:e.actionButton,onClick:t.onRotated,disabled:!t.canRotate,children:"Rotate"}),l("button",{className:e.actionButton,onClick:t.onConfirm,disabled:!t.placementValid,children:"Confirm"})]})]})}const Tt=M({wrapper:{display:"grid",gridTemplateColumns:"5fr 1fr",gridTemplateRows:"100%",width:"100%",height:"100%",columnGap:"10px","@media (max-width: 640px)":{gridTemplateColumns:"100%",gridTemplateRows:"5fr 1fr",rowGap:"10px"}}});function Pt(t){const[e,i]=f.exports.useState([]),[n,o]=f.exports.useState([]),[s,r]=f.exports.useState(void 0),[c,a]=f.exports.useState(void 0),[h,m]=f.exports.useState(0),g=Tt(),d=Object.values(e);(s==null?void 0:s.ship)&&d.push(s.ship);const y=!!(s==null?void 0:s.ship)&&we(s.ship,Object.values(e),t.gameSettings.gridSize),k=h===0?d.length===t.gameSettings.ships.length&&ge(d,t.gameSettings.gridSize):n.length===t.gameSettings.mines,F=y?"green":"red",D=c?[{x:c.x,y:c.y,style:F}]:[],W=h===1?t.gameSettings.mines-n.length:void 0,H=v=>{if(v!==(s==null?void 0:s.id)){const P=b({},e);(s==null?void 0:s.ship)&&(P[s.id]=s.ship),e[v]?(r({id:v,ship:e[v]}),a(e[v]),delete P[v]):(r({id:v,ship:void 0}),a(void 0)),i(P)}},S=()=>{(s==null?void 0:s.ship)&&r({id:s.id,ship:x(b({},s.ship),{facing:(s.ship.facing+1)%6})})},T=()=>{k&&(h===1||t.gameSettings.mines===0?t.onFleetPlaced({ships:d,mines:n}):(m(1),a(void 0)))},E=v=>{if(s){if(s.ship)r({id:s.id,ship:x(b({},s.ship),{x:v.x,y:v.y})});else{const P=t.gameSettings.ships.find($=>$.id===s.id);P&&r({id:s.id,ship:{x:v.x,y:v.y,size:P.size,facing:me.positiveX,hits:0,name:P.name,definitionId:P.id}})}a(v)}},ne=v=>{if(!d.map(q).flat().some($=>z($,v))){const $=n.findIndex(A=>z(A,v));if($===-1)n.length<t.gameSettings.mines&&o([...n,v]);else{const A=[...n];A.splice($,1),o(A)}}},se=v=>{h===0?E(v):h===1&&ne(v)},oe=()=>(s==null?void 0:s.id)||h===1?"orange":void 0;return u("div",{className:g.wrapper,children:[l(de,{gridSize:t.gameSettings.gridSize,ships:d,mines:n,onSelectTile:se,highlightTiles:D,mouseHighlightStyle:oe}),l(Mt,{ships:t.gameSettings.ships,mines:W,placedIds:Object.keys(e).map(Number),selectedId:s==null?void 0:s.id,placementValid:k,canRotate:!!s,onSelected:H,onRotated:S,onConfirm:T})]})}const Bt=M({statusPanel:{position:"relative",padding:{top:10,left:10,right:10,bottom:60},boxSizing:"border-box",minHeight:90,width:"100%",maxWidth:200,gridArea:"panel","@media (max-width: 640px)":{padding:0},display:"grid",gridTemplateColumns:"100%",gridTemplateRows:"repeat(7, 1fr)"},info:{fontFamily:_,color:C,fontSize:"2rem",margin:0,"@media (max-width: 640px)":{fontSize:"1rem"}},enemyShipHeader:{fontFamily:_,color:C,fontSize:"1.6rem",margin:{top:10,bottom:0},"@media (max-width: 640px)":{fontSize:"0.8rem"}},enemyShips:{display:"grid",gridTemplateColumns:"100%",gridTemplateRows:"repeat(6, 1fr)","@media (max-width: 640px)":{gridTemplateColumns:"1fr 1fr",gridTemplateRows:"repeat(3, 1fr)"}},enemyShip:{border:"2px solid black",color:C,fontFamily:"sans-serif",fontSize:"1.2rem",position:"relative",padding:4,margin:{top:5},"@media (max-width: 640px)":{fontSize:"0.6rem",padding:2}},enemyShipSunk:{border:"2px solid red","&:after":{width:"100%",height:"100%",display:"inline-block",position:"absolute",top:0,left:0,content:'""',background:"linear-gradient(10deg, transparent 47%, red 47%, red 53%, transparent 53%), linear-gradient(170deg, transparent 47%, red 47%, red 53%, transparent 53%)"}},fire:{border:"2px solid #ccc",cursor:"pointer",color:"white",fontSize:"1.5rem",textShadow:"1px 1px 0 black",background:"radial-gradient(#ff8000, #ff0000)",textTransform:"uppercase","&:hover":{background:"radial-gradient(#ffa447, #ff4747)"},"&:disabled":{color:"#aaa",background:"#777",cursor:"default"}},shotsRemaining:{color:C,fontFamily:"sans-serif",fontSize:"1.2rem","@media (max-width: 640px)":{fontSize:"0.6rem"}}});function Ht(t){var i;const e=Bt();return u("div",{className:e.statusPanel,children:[t.statusMessage&&l("p",{className:e.info,children:t.statusMessage}),((i=t.ships)==null?void 0:i.length)&&u(O,{children:[l("p",{className:e.enemyShipHeader,children:"Enemy Ships"}),u("div",{className:e.enemyShips,children:[t.ships.map(n=>u("div",{className:`${e.enemyShip} ${t.sunkShipIds&&t.sunkShipIds.indexOf(n.id)!==-1?e.enemyShipSunk:""}`,children:[n.name," (",n.size,")"]},n.id)),t.fireButtonVisible&&u(O,{children:[l("button",{className:e.fire,onClick:t.onFireClick,disabled:!t.fireButtonEnabled,children:"Fire"}),!!t.shotsRemaining&&u("p",{className:e.shotsRemaining,children:[t.shotsRemaining," shot",t.shotsRemaining===1?"":"s"," remaining"]})]})]})]})]})}const It=M({wrapper:{display:"grid",gridTemplateRows:"100%",gridTemplateColumns:"4fr 4fr 1fr",width:"100%",height:"100%",gridTemplateAreas:'"friend enemy panel"',"@media (max-width: 640px)":{gridTemplateColumns:"8fr 1fr",gridTemplateRows:"4fr 3fr",gridTemplateAreas:'"enemy enemy" "friend panel"'}},menuButton:{position:"absolute",left:10,top:10,zIndex:10,border:"2px solid white",background:"#333",color:C,fontSize:"1rem"}});function Lt(t){const[e,i]=f.exports.useState(void 0),[n,o]=f.exports.useState(0),[s,r]=f.exports.useState([]),[c,a]=f.exports.useState(!1),[h,m]=f.exports.useState([]),[g,d]=f.exports.useState([]),y=It(),k=t.gameInterface.getSettings();f.exports.useEffect(()=>{const p=N=>{var ye;i(x(b({},N),{ownMarkers:N.ownMarkers.slice(0),opponentMarkers:N.opponentMarkers.slice(0),ownShips:N.ownShips.slice(0),isOwnTurn:N.isOwnTurn,sunkEnemies:N.sunkEnemies.slice(0)}));const V=N.opponentMarkers.length-h.length;V>0&&(d(N.opponentMarkers.slice(-V)),m([...N.opponentMarkers]));let U=0;N.gameWon||N.gameLost?U=3:((ye=N.ownShips)==null?void 0:ye.length)&&(N.opponentShipsPlaced?U=2:U=1),o(U)};return t.gameInterface.onStateChange(p),()=>{t.gameInterface.offStateChange(p)}},[t.gameInterface,e,h.length]);const F=p=>{t.gameInterface.setFleet(p)},D=p=>!(e==null?void 0:e.ownMarkers.some(N=>z(p,N))),W=(e==null?void 0:e.isOwnTurn)&&n===2,H=e?fe(k,e):0,S=p=>{if(W&&D(p)){const N=s.findIndex(V=>z(V,p));if(N===-1)H===1?r([p]):s.length<H&&r([...s,p]);else{const V=[...s];V.splice(N,1),r(V)}}},T=p=>W&&D(p)?"orange":void 0,E=()=>{s.length===H&&s.every(p=>D(p))&&(t.gameInterface.fireShots(s),r([]))},ne=()=>{a(!0)},se=()=>{t.gameInterface.leaveGame(),t.onExit()},oe=()=>{a(!1)},v=g.map(p=>({x:p.x,y:p.y,style:"orange"}));let P;n===2?P=(e==null?void 0:e.isOwnTurn)?"Take your shot":"Enemy's turn":n===3?(e==null?void 0:e.opponentLeft)?P="Your opponent left":P=`You have ${(e==null?void 0:e.gameWon)?"Won":"Lost"}`:n===1&&(P="Enemy placing ships");let $;(e==null?void 0:e.gameWon)?$=e.ownMarkers.filter(p=>p.type===R.Hit).map(p=>({x:p.x,y:p.y,style:"red"})):$=s.map(p=>({x:p.x,y:p.y,style:"red"}));let A;(e==null?void 0:e.gameWon)?A="rgba(0, 255, 0, 0.3)":(e==null?void 0:e.gameLost)&&(A="rgba(255, 0, 0, 0.3)");const Ie=W&&(k.shots>1||k.shotPerShip)?H-s.length:void 0;return u(O,{children:[c&&l(Be,{onOk:se,onClose:oe,okButton:!0,cancelButton:!0,children:"Are you sure you want to end the game?"}),l("button",{className:y.menuButton,onClick:ne,children:"Menu"}),n===0?l(Pt,{gameSettings:k,onFleetPlaced:F}):u("div",{className:y.wrapper,children:[l(de,{gridSize:k.gridSize,ships:e==null?void 0:e.ownShips,mines:e==null?void 0:e.ownMines,markers:e==null?void 0:e.opponentMarkers,highlightTiles:v,gridArea:"friend",overlayStyle:A}),l(de,{gridSize:k.gridSize,ships:e==null?void 0:e.opponentShips,mines:e==null?void 0:e.opponentMines,markers:e==null?void 0:e.ownMarkers,onSelectTile:S,highlightTiles:$,mouseHighlightStyle:T,gridArea:"enemy",overlayStyle:A}),l(Ht,{statusMessage:P,ships:n===1?void 0:k.ships,sunkShipIds:e==null?void 0:e.sunkEnemies,fireButtonVisible:n===2,fireButtonEnabled:!!(s.length===H&&(e==null?void 0:e.isOwnTurn)),shotsRemaining:Ie,onFireClick:E})]})]})}const Ot=M({container:{backgroundColor:"#022866",width:"100%",height:"100%",overflow:"auto"}});function Ft(){const[t,e]=f.exports.useState(null),[i,n]=f.exports.useState(!1),[o,s]=f.exports.useState(void 0),r=Ot();f.exports.useEffect(()=>{const h=Ge();s(h),h.on("connect",()=>{n(!0)})},[]);const c=h=>{e(h)},a=()=>{e(null)};return l("div",{className:r.container,children:t?l(Lt,{gameInterface:t,onExit:a}):l(St,{onNewGame:c,socket:o,isConnected:i})})}ke.setAppElement("#root");De.render(l($e.StrictMode,{children:l(Ft,{})}),document.getElementById("root"));
