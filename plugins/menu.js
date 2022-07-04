let fs = require('fs') 
let path = require('path')
let moment = require('moment-timezone')
let {
  hostname,
  totalmem,
  freemem,
  platform
} = require('os')
let {
  cpu
} = require('node-os-utils')
let { 
sizeFormatter 
} = require('human-readable')
//anu
let format = sizeFormatter({
std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
decimalPlaces: 2,
keepTrailingZeroes: false,
render: (literal, symbol) => `${literal} ${symbol}B`,
})
let cpuPer
let p1 = cpu.usage().then(cpuPercentage => {
    cpuPer = cpuPercentage
}).catch(() => {
    cpuPer = NotDetect
})

let handler = async (m, { conn, usedPrefix: _p }) => {
  await Promise.all([p1])
let tags = {
      'main': 'MAIN', 
      'group': 'GROUP', 
      'downloader': 'DOWNLOADER',
      'info': 'INFO',
      'tools': 'TOOLS',
      'host': 'HOST'
  }

const defaultMenu = {
  before: `
╭──〔  𝐓 𝐎 𝐃 𝐀 𝐘  〕─⬣
┃➵͜͡✪ Date : %week %weton, %date M*
┃➵͜͡✪ Date - islamic : %dateIslamic*
┃➵͜͡✪ WIB : %wib* 
┃➵͜͡✪ WITA : %wita* 
┃➵͜͡✪ WIT : %wit*
┃
┃──〔  sᴇʀᴠᴇʀ ɪɴғᴏ  〕─⬣
┃➵͜͡✪ HostName : ${hostname()}*
┃➵͜͡✪ Platform : ${platform()}*
┃➵͜͡✪ CPU : ${cpuPer}%*
┃➵͜͡✪ CPU Core : ${cpu.count()} Core*
┃➵͜͡✪ Ram : ${format(totalmem() - freemem())} / ${format(totalmem())}*
┃➵͜͡✪ Runtime : %uptime ( %muptime )*
╰─────────────⬣

               *﹝ ᴇᴠᴇɴᴛ ɪɴғᴏ ﹞*
*✘⃟🌹 ${global.Evn}*
*✘⃟🌹 ${global.timeEvn}*
%readmore`.trimStart(),
  header: '╭─❑ 〔 %category 〕 ❑─\n┃',
  body: '┃⫹⫺ *%cmd* %isLimit %isPremium',
  footer: '┃\n╰────────❑\n',
  after: `*%npmname@^%version*
${'```%npmdesc```'}
`
}

  try {
let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
//info cmd
let sortedCmd = Object.entries(global.db.data.stats).map(([key, value]) => {
  return { ...value, name: key }
  }).map(toNumber('total')).sort(sort('total'))
  
  let all = 0;
  let sall = 0;
  for (let i of sortedCmd){
  all += i.total
  sall += i.success
  }
    let totalcmd = Object.values(global.plugins).length
    let namabot = conn.user.name
    let oname = await conn.getName(owner[0]+'@s.whatsapp.net')
    let nobot = parseInt(conn.user.jid)
    let name = conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let weton = [
      'Pahing', 
      'Pon', 
      'Wage', 
      'Kliwon', 
      'Legi'
    ][Math.floor(d / 84600000) % 5]
    let wib = moment.tz('Asia/Jakarta').format("HH:mm:ss")
    let wita = moment.tz('Asia/Makassar').format("HH:mm:ss")
    let wit = moment.tz('Asia/Jayapura').format("HH:mm:ss")
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        url: plugin.text,
        text: plugin.text,
        number: plugin.number,
        options: plugin.opsions,
        enabled: !plugin.disabled,
      }
    })
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
      // for (let tag of plugin.tags)
      //   if (!(tag in tags)) tags[tag] = tag
    }
    // for (let plugin of help)
      // if (plugin && 'tags' in plugin)
        // for (let tag of plugin.tags)
         // if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer 
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Dipersembahkan oleh https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
        before,
        ...Object.keys(tags).map(tag => {
          return header.replace(/%category/g, tags[tag]) + '\n' + [
            ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
              return menu.help.map(help => {
                return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                  .replace(/%isLimit/g, menu.limit ? `${lIm}` : '')
                  .replace(/%isPremium/g, menu.premium ? `${pRm}` : '')
                  .trim()
              }).join('\n')
            }),
            footer
          ].join('\n')
        }),
        after
      ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, 
      totalcmd,
      all,
      sall,
      oname,
      nobot,
      namabot,
      name,
      uptime, 
      muptime,
      wit, 
      wita, 
      wib, 
      week,
      weton,
      date,
      dateIslamic,
      readmore: readMore,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    
    conn.sendHydrated(m.chat, text, `ChatBot By Oᵂηʀ᭄๖ۣۣۜAz꧅
    `, mediaMenu, uRlx, dTux, null, null, bTnx, m, { asLocation: true})
      
   } catch (e) {
    throw e
  }
}
//handler.help = ['menu', 'help', '?']
//handler.tags = ['info']
handler.command = /^(command|menu|menulist|listmenu|\?)$/i
module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function pRandom(items){
  return items[Math.floor(Math.random() * items.length)];
}

function sort(property, ascending = true) {
  if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
  else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
  if (property) return (a, i, b) => {
      return { ...b[i], [property]: a[property] === undefined ? _default : a[property] }
  }
  else return a => a === undefined ? _default : a
}

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
