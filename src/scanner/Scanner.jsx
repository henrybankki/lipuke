import React, {useEffect, useRef, useState} from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { getDB } from '../firebase'
import { ref, get, update } from 'firebase/database'

export default function Scanner(){
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState([])
  const qrRef = useRef(null)
  const db = getDB()

  useEffect(()=> {
    return ()=> {
      if(qrRef.current) {
        qrRef.current.clear().catch(()=>{})
      }
    }
  },[])

  const append = (t) => setLog(l=>[t,...l].slice(0,30))

  const onScanSuccess = async (decodedText, decodedResult) => {
    try {
      const data = JSON.parse(decodedText)
      if(!data.id){ append('Tuntematon data'); beep(); return }
      const snap = await get(ref(db, `tickets/${data.id}`))
      const val = snap.val()
      if(!val){
        append(`Tuntematon lipuke: ${data.id}`)
        beep()
        return
      }
      // Jos ei tilaa, oletetaan sisään
      const current = val.status || 'none'
      // Prompt logic: if same direction twice warn
      if(current === 'none'){
        await update(ref(db, `tickets/${data.id}`), { status: 'in', updatedAt: Date.now() })
        append(`Sisään: ${data.id} ${val.name||''}`)
      } else {
        // ask user to choose in/out
        const choice = window.confirm('Merkitäänkö sisään? OK = sisään, Cancel = ulos')
        const newStatus = choice ? 'in' : 'out'
        if(newStatus === current){
          append(`Virhe: sama tila jo (${current}) — ${data.id}`)
          beep()
        } else {
          await update(ref(db, `tickets/${data.id}`), { status: newStatus, updatedAt: Date.now() })
          append(`${newStatus === 'in' ? 'Sisään' : 'Ulos'}: ${data.id} ${val.name||''}`)
        }
      }
    } catch (e){
      append('Virhe lukemisessa')
      beep()
    }
  }

  function beep(){
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = 880
      o.connect(ctx.destination)
      o.start()
      setTimeout(()=>{ o.stop(); ctx.close() }, 120)
    }catch(e){}
  }

  const startCamera = async () => {
    if(running) return
    const html5QrCode = new Html5Qrcode('reader')
    qrRef.current = html5QrCode
    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess
      )
      setRunning(true)
      append('Kamera käynnistetty')
    } catch (e){
      append('Kameran avaaminen epäonnistui: ' + e)
    }
  }

  const stopCamera = async () => {
    if(qrRef.current){
      await qrRef.current.stop()
      await qrRef.current.clear()
      qrRef.current = null
    }
    setRunning(false)
    append('Kamera suljettu')
  }

  return (
    <div>
      <div style={{marginBottom:8}}>
        <button className="btn" onClick={startCamera} disabled={running}>Avaa kamera</button>
        <button className="btn" onClick={stopCamera} style={{marginLeft:8}} disabled={!running}>Sulje kamera</button>
      </div>
      <div id="reader" style={{width:320,height:280,background:'#021224',borderRadius:8}}></div>
      <h4>Viimeisimmät:</h4>
      <div className="list log">
        {log.map((l,i)=>(<div key={i}>{l}</div>))}
      </div>
    </div>
  )
}
