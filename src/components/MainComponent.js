import React, { Component } from 'react';
import Home from './HomeComponent';
import About from './AboutComponent';
import Product from './ProductComponent';
import Contact from './ContactComponent';
import ProductDetail from './ProductdetailComponent';
import Favorites from './FavoriteComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postComment, postFeedback, fetchProducts, fetchComments, fetchPromos, fetchLeaders, loginUser, logoutUser, fetchFavorites, postFavorite, deleteFavorite } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStateToProps = state => {
    return {
      products: state.products,
      comments: state.comments,
      promotions: state.promotions,
      leaders: state.leaders,
      favorites: state.favorites,
      auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => ({
  postComment: (productId, rating, comment) => dispatch(postComment(productId, rating, comment)),
  fetchProducts: () => {dispatch(fetchProducts())},
  resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
  fetchComments: () => {dispatch(fetchComments())},
  fetchPromos: () => {dispatch(fetchPromos())},
  fetchLeaders: () => dispatch(fetchLeaders()),
  postFeedback: (feedback) => dispatch(postFeedback(feedback)),
  loginUser: (creds) => dispatch(loginUser(creds)),
  logoutUser: () => dispatch(logoutUser()),
  fetchFavorites: () => dispatch(fetchFavorites()),
  postFavorite: (productId) => dispatch(postFavorite(productId)),
  deleteFavorite: (productId) => dispatch(deleteFavorite(productId))
});

class Main extends Component {

  componentDidMount() {
    this.props.fetchProducts();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
    this.props.fetchFavorites();
  }

  render() {

    const HomePage = () => {
      return(
        <Home product={this.props.products.products.filter((product) => product.featured)[0]}
          productsLoading={this.props.products.isLoading}
          productsErrMess={this.props.products.errMess}
          promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
          promosLoading={this.props.promotions.isLoading}
          promosErrMess={this.props.promotions.errMess}
          leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
          leaderLoading={this.props.leaders.isLoading}
          leaderErrMess={this.props.leaders.errMess}
        />
      );
    }

    const ProductWithId = ({match}) => {
      return(
        this.props.auth.isAuthenticated
        ?
        <ProductDetail product={this.props.products.products.filter((product) => product._id === match.params.productId)[0]}
          isLoading={this.props.products.isLoading}
          errMess={this.props.products.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.product === match.params.productId)}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
          favorite={this.props.favorites.favorites.products.some((product) => product._id === match.params.productId)}
          postFavorite={this.props.postFavorite}
          />
        :
        <ProductDetail product={this.props.products.products.filter((product) => product._id === match.params.productId)[0]}
          isLoading={this.props.products.isLoading}
          errMess={this.props.products.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.product === match.params.productId)}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
          favorite={false}
          postFavorite={this.props.postFavorite}
          />
      );
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={(props) => (
        this.props.auth.isAuthenticated
          ? <Component {...props} />
          : <Redirect to={{
              pathname: '/home',
              state: { from: props.location }
            }} />
      )} />
    );

    return (
      <div>
        <Header auth={this.props.auth} 
          loginUser={this.props.loginUser} 
          logoutUser={this.props.logoutUser} 
          />   
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
            <Switch>
              <Route path="/home" component={HomePage} />
              <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders} />} />} />
              <Route exact path="/product" component={() => <Product products={this.props.products} />} />
              <Route path="/Product/:productId" component={ProductWithId} />
              <PrivateRoute exact path="/favorites" component={() => <Favorites favorites={this.props.favorites} deleteFavorite={this.props.deleteFavorite} />} />
              <Route exact path="/contactus" component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback} />} />
              <Redirect to="/home" />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
