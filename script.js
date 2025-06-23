const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const albumCover = document.getElementById('album-cover');
const playlistItems = document.getElementById('playlist-items');


const tracks = [
    {
        title: 'Sample Track 1',
        artist: 'Artist 1',
        src: 'audio/audio_6.mpeg',
        cover: 'https://i.ytimg.com/vi/mMgseX5qGac/sddefault.jpg'
    },
    {
        title: 'Sample Track 2',
        artist: 'Artist 2',
     src: 'audio/audio_2.mpeg',
        cover: 'https://i.pinimg.com/736x/94/e2/2a/94e22ade5b8aae698e8275599c754bcb.jpg'
    },
    {
        title: 'Sample Track 3',
        artist: 'Artist 3',
        src: 'audio/audio_3.mpeg',
        cover: 'https://i.pinimg.com/736x/5b/bb/f7/5bbbf778d5dcaf8265363b2c1a6fbe25.jpg'
    },
      {
        title: 'Sample Track 4',
        artist: 'Artist 3',
        src: 'audio/audio_4.mpeg',
        cover: 'https://i.pinimg.com/736x/b5/dd/da/b5dddac2676d23155c2726688e6fcec8.jpg'
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let playedTracks = []; 


function loadPlaylist() {
    playlistItems.innerHTML = '';
    tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = `${track.title} - ${track.artist}`;
        li.dataset.index = index;
        if (index === currentTrackIndex) li.classList.add('active');
        li.addEventListener('click', () => playTrack(index));
        playlistItems.appendChild(li);
    });
}


function loadTrack(index) {
    const track = tracks[index];
    audioPlayer.src = track.src;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    albumCover.src = track.cover;
    albumCover.alt = `${track.title} Album Cover`;
    currentTrackIndex = index;
    loadPlaylist();
}


function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶';
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = '⏸';
    }
    isPlaying = !isPlaying;
}

// Play specific track
function playTrack(index) {
    loadTrack(index);
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    loadPlaylist();
    if (isShuffle) {
        playedTracks.push(index);
    }
}

function getRandomTrackIndex() {
    const availableTracks = tracks
        .map((_, index) => index)
        .filter(index => !playedTracks.includes(index));
    if (availableTracks.length === 0) {
        playedTracks = []; // Reset when all tracks have been played
        return Math.floor(Math.random() * tracks.length);
    }
    return availableTracks[Math.floor(Math.random() * availableTracks.length)];
}


function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}


playPauseBtn.addEventListener('click', togglePlayPause);

prevBtn.addEventListener('click', () => {
    if (isShuffle) {
        // In shuffle mode, go back to the previous played track
        if (playedTracks.length > 1) {
            playedTracks.pop(); // Remove current track
            currentTrackIndex = playedTracks[playedTracks.length - 1];
        } else {
            currentTrackIndex = getRandomTrackIndex();
        }
    } else {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    }
    playTrack(currentTrackIndex);
});

nextBtn.addEventListener('click', () => {
    if (isShuffle) {
        currentTrackIndex = getRandomTrackIndex();
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    }
    playTrack(currentTrackIndex);
});

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    playedTracks = isShuffle ? [currentTrackIndex] : [];
});

audioPlayer.addEventListener('timeupdate', () => {
    const { currentTime, duration } = audioPlayer;
    progressBar.value = (currentTime / duration) * 100 || 0;
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration || 0);
});

progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value;
});

audioPlayer.addEventListener('ended', () => {
    if (isShuffle) {
        currentTrackIndex = getRandomTrackIndex();
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    }
    playTrack(currentTrackIndex);
});


document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
    } else if (e.key === 'ArrowLeft') {
        prevBtn.click();
    } else if (e.key === 'ArrowRight') {
        nextBtn.click();
    } else if (e.key === 's' || e.key === 'S') {
        shuffleBtn.click();
    }
});

loadTrack(currentTrackIndex);
loadPlaylist();
