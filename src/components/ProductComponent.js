import React from 'react';
import { Card, CardImg, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

    function RenderProductItem({ product, onClick }) {
        return(
            <Card>
                <Link to={`/product/${product._id}`} >
                    <CardImg width="100%" src={baseUrl + product.image} alt={product.name} />
                    <CardImgOverlay>
                        <CardTitle>{product.name}</CardTitle>
                    </CardImgOverlay>
                </Link>
            </Card>
        );
    }

    const Product = (props) => {

        const product = props.products.products.map((product) => {
            return (
                <div key={product._id} className="col-12 col-md-5 m-1">
                    <RenderProductItem product={product} />
                </div>
            );
        });

        if (props.products.isLoading) {
            return(
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.products.errMess) {
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.products.errMess}</h4>
                    </div>
                </div>
            );
        }
        else
            return (
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to='/home'>Home</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Product</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>Product</h3>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        {product}
                    </div>
                </div>
            );
    }

export default Product;