import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import MoviesTable from "./moviesTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import SearchBox from "./searchBox";
import LoadingSpinner from "./common/loadingSpinner";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import { findBestMatch } from "string-similarity";
import _ from "lodash";

class Movies extends Component {
  newMovie = React.createRef();

  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
    isLoading: false,
    hoverEffectLeft: 0,
    hoverEffectTop: 0,
    showHoverEffect: true,
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({
      movies,
      genres,
      selectedGenre: genres[0],
      isLoading: false,
    });
  }

  handleDelete = async (movie) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted!");

      this.setState({ movies: originalMovies });
    }
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      selectedGenre: this.state.genres[0],
      currentPage: 1,
    });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      movies: allMovies,
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter((m) => {
        let titles = [];
        let result = [];
        allMovies.forEach((movie) => titles.push(movie.title.toLowerCase()));
        const best = findBestMatch(searchQuery.toLowerCase(), titles).ratings;
        best.forEach((element) => {
          if (element.rating > 0.45) result.push(element.target);
        });
        if (result.length === 0)
          return m.title.toLowerCase().startsWith(searchQuery.toLowerCase());
        return result.includes(m.title.toLowerCase());
      });
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  follow = (e) => {
    const { x, y } = this.newMovie.current.getBoundingClientRect();
    this.setState({
      hoverEffectLeft: e.clientX - parseInt(x),
      hoverEffectTop: e.clientY - parseInt(y),
    });
  };

  showHover = () => {
    this.setState({ showHoverEffect: false });
  };

  hideHover = () => {
    this.setState({ showHoverEffect: true });
  };

  render() {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      isLoading,
      hoverEffectLeft,
      hoverEffectTop,
      showHoverEffect,
    } = this.state;

    const { totalCount, data: movies } = this.getPagedData();

    return (
      <div className={isLoading ? "row justify-content-center" : "row"}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <React.Fragment>
            <div className="col-3">
              <ListGroup
                items={this.state.genres}
                selectedItem={this.state.selectedGenre}
                onItemSelect={this.handleGenreSelect}
              />
            </div>
            <div className="col">
              <div className="info">
                <p>Showing {totalCount} movies in the database.</p>
                <div
                  className="new-movie-container"
                  onMouseOver={this.showHover}
                  onMouseOut={this.hideHover}
                  onMouseMove={this.follow}
                >
                  <Link
                    ref={this.newMovie}
                    to="/movies/new"
                    className="new-movie"
                    onMouseDown={this.hideHover}
                    onMouseUp={this.showHover}
                  >
                    <div
                      style={{
                        top: hoverEffectTop,
                        left: hoverEffectLeft,
                      }}
                      className="hoverEffect"
                      hidden={showHoverEffect}
                    ></div>
                    <i style={{ marginRight: 2 }} className="fa fa-plus"></i>
                    New Movie
                  </Link>
                </div>
              </div>
              <SearchBox value={searchQuery} onChange={this.handleSearch} />
              <MoviesTable
                movies={movies}
                sortColumn={sortColumn}
                onLike={this.handleLike}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
              />
              <Pagination
                itemsCount={totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={this.handlePageChange}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Movies;
