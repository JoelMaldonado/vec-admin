'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
})

const DEFAULT: [number, number] = [-14.0678, -75.7286] // Ica, Perú

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onClick(e.latlng.lat, e.latlng.lng) },
  })
  return null
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap()
  const prev = useRef<string>('')
  useEffect(() => {
    if (!target) return
    const key = target.join(',')
    if (key === prev.current) return
    prev.current = key
    map.flyTo(target, 16, { animate: true, duration: 1 })
  }, [target, map])
  return null
}

interface MapPickerProps {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}

export function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const markerRef = useRef<L.Marker>(null)
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null)

  const position: [number, number] = lat != null && lng != null ? [lat, lng] : DEFAULT
  const hasPin = lat != null && lng != null

  async function handleSearch() {
    const q = query.trim()
    if (!q) return
    setIsSearching(true)
    setSearchError(null)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'es' } },
      )
      const results: { lat: string; lon: string }[] = await res.json()
      if (results.length === 0) { setSearchError('Dirección no encontrada.'); return }
      const newLat = parseFloat(results[0].lat)
      const newLng = parseFloat(results[0].lon)
      setFlyTarget([newLat, newLng])
      onChange(newLat, newLng)
    } catch {
      setSearchError('Error al buscar. Intenta de nuevo.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* Search bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Buscar dirección en el mapa..."
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          {isSearching
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
            : <Search className="h-4 w-4" />}
        </button>
      </div>

      {searchError && <p className="text-xs text-red-500">{searchError}</p>}

      {/* Map */}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <MapContainer
          center={position}
          zoom={hasPin ? 16 : 13}
          style={{ height: 280, width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ClickHandler onClick={onChange} />
          <FlyTo target={flyTarget} />
          <Marker
            position={position}
            icon={markerIcon}
            draggable
            ref={markerRef}
            eventHandlers={{
              dragend() {
                const m = markerRef.current
                if (m) {
                  const { lat, lng } = m.getLatLng()
                  onChange(lat, lng)
                }
              },
            }}
            opacity={hasPin ? 1 : 0}
          />
        </MapContainer>
      </div>

      <p className="text-xs text-slate-400">
        Busca la dirección, haz clic en el mapa o arrastra el marcador para ajustar la ubicación exacta.
      </p>

      {hasPin && (
        <p className="font-mono text-xs text-slate-400">
          {lat!.toFixed(6)}, {lng!.toFixed(6)}
        </p>
      )}
    </div>
  )
}
