interface Song {
  id: string;
  name: string;
  artist: Artist;
  album: Album;
}

interface Album {
  id: string;
  name: string;
  songs: Song[];
}

interface Artist {
  id: string;
  name: string;
  songs: Song[];
  albums: Album[];
}

class Playlist {
  public id: string;
  public shuffle = false;

  protected songs: Song[];

  constructor(public name: string) {}

  addSong(song: Song): void {
    this.songs.push(song);
  }

  removeSong(song: Song): void {
    this.songs = this.songs.filter(
      (songFromList) => songFromList.id !== song.id
    );
  }

  getNextSong(song: Song): Song | undefined {
    if (!this.songs.length) {
      return undefined;
    }

    if (!this.shuffle) {
      for (let i = 0; i < this.songs.length; i++) {
        if (song.id === this.songs[i].id) {
          return this.songs[i % this.songs.length];
        }
      }

      return this.songs[0];
    } else {
      const i = Math.floor(Math.random() * this.songs.length);
      return this.songs[i];
    }
  }
}

class Queue extends Playlist {
  addAsFirst(song: Song): void {
    this.songs.unshift(song);
  }
}

interface CD {
  songs: Song[];
}

class JukeBox {
  private artists: Map<string, Artist>;
  private playlists: Playlist[];
  private currentPlaylist: Playlist;
  private currentSong: Song;
  private playTime: number;
  private queue: Queue;
  private prevSongs: Song[];
  private cdPlaylist: Playlist;
  private loggedInUser: User;
  private songPrice: number;
  private stateSubscribers: jukeBoxStateSubscriber[];
  private state: JukeboxState;

  constructor(private songs: Map<string, Song>) {
    this.queue = new Queue("queue");

    Array.from(songs.values()).forEach((song) =>
      this.artists.set(song.artist.id, song.artist)
    );
  }

  createPlaylist(name: string): Playlist {
    const newPlaylist = new Playlist(name);
    this.playlists.push(newPlaylist);

    return newPlaylist;
  }

  deletePlaylist(playlist: Playlist): void {
    if (this.currentPlaylist.name === playlist.name) {
      // handle
    }

    this.playlists = this.playlists.filter(
      (deletedPlaylist) => deletedPlaylist.name !== playlist.name
    );
  }

  findPlaylist(query: string): Playlist[] {
    return this.playlists.filter((playlist) => playlist.name.includes(query));
  }

  // + CRUD for artists

  playSong(song: Song, playlistId: string) {
    this.currentPlaylist = [...this.playlists, this.cdPlaylist].find(
      (playlist) => playlist.id === playlistId
    );

    if (!this.currentPlaylist) {
      // handle
    }

    this.currentSong = song;

    this.loggedInUser.charge(this.songPrice);
  }

  playNext(): void {
    let nextSong = this.queue.getNextSong(this.currentSong);

    if (!nextSong) {
      nextSong = this.currentPlaylist.getNextSong(this.currentSong);
    }

    if (!nextSong) {
      // handle
    }

    this.prevSongs.push(this.currentSong);

    this.playSong(nextSong, this.currentPlaylist.id);
  }

  playPrev(): void {
    this.queue.addAsFirst(this.currentSong);

    const prevSong = this.prevSongs.pop();
    if (!prevSong) {
      // handle
    }

    this.playSong(prevSong, this.currentPlaylist.id);
  }

  pause(): void {}

  stop(): void {}

  addSongToQueue(song: Song): void {
    this.queue.addSong(song);
  }

  login(user: User): void {
    this.loggedInUser = user;
  }

  insertCD(cd: CD): void {
    const cdPlaylist = new Playlist("cd");

    for (let song of cd.songs) {
      cdPlaylist.addSong(song);
    }
  }

  removeCD(): void {
    this.cdPlaylist = undefined;
  }

  subscribeToStateChanges(subscriber: jukeBoxStateSubscriber): void {
    this.stateSubscribers.push(subscriber);
  }

  unsubscribeFromStateChanges(subscriber: jukeBoxStateSubscriber): void {
    // remove from list
  }

  notifySubscribers(): void {
    this.stateSubscribers.forEach((subscriber) => {
      subscriber.update({
        time: this.playTime,
        song: this.currentSong,
        state: this.state,
      });
    });
  }
}

class User {
  credit: number;
  playlists: Playlist[];

  charge(amount: number): void {
    this.credit = this.credit - amount;
  }
}

enum JukeboxState {
  Playing,
  Pause,
  Stop,
}

// Observer pattern
interface displayData {
  state: JukeboxState;
  song?: Song;
  time?: number;
}

interface jukeBoxStateSubscriber {
  update(displayData: displayData);
}

class Display implements jukeBoxStateSubscriber {
  update(displayData: displayData) {
    this.showInfo(displayData);
  }

  private showInfo(displayData: displayData): void {}
}
