<div className="search">
  <input
    value={location}
    onChange={event => setLocation(event.target.value)}
    onKeyPress={searchLocation}
    placeholder='Enter Location'
    type="text" />
  {error && <p className="error">{error}</p>}
</div>