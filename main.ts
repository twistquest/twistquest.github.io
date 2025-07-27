const albumCover = document.getElementById("album-cover") as HTMLImageElement;
const songTitle = document.getElementById("song-title") as HTMLElement;
const songArtist = document.getElementById("song-artist") as HTMLElement;
const songStatus = document.getElementById("song-status") as HTMLElement;

async function fetchSongData() {
  const response = await fetch(
    "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=holetohades&api_key=9065aa245c87c2609c4270c0935ab7b5&format=json&limit=1",
  );
  // please dont steal my key for nefarious purpouses
  function getDate(uts: string) {
    const date: number = Date.now();
    const playedDate: number = new Date(Number(uts) * 1000).getTime();
    const diff: number = date - playedDate;
    const timeSince: number = diff / 86400000;
    const timeSinceDays: number = Math.floor(timeSince);
    if (timeSinceDays === 0) {
      return "today";
    } else if (timeSinceDays === 1) {
      return "yesterday";
    } else {
      return `${timeSinceDays} days ago`;
    }
  }
  if (!response.ok) {
    songTitle.textContent = `Error ${response.status} ${response.statusText} (this isnt my fault its lastfm i swear)`;
    songArtist.textContent = "";
    songStatus.textContent = "";
    albumCover.src = "yum.webp";
  } else {
    const data = await response.json();
    const track = data.recenttracks.track[0];
    albumCover.src = track.image[2]["#text"];
    songTitle.textContent = track.name;
    songArtist.textContent = track.artist["#text"];
    if (track["@attr"] && track["@attr"].nowplaying === "true") {
      songStatus.textContent = "Now Playing";
      songStatus.style.color = "#a6e3a1";
    } else {
      songStatus.textContent = `Last played ${getDate(track.date.uts)}`;
      songStatus.style.color = "#eba0ac";
    }
  }
}

fetchSongData();
setInterval(fetchSongData, 30000);
