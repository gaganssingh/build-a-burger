import React from "react";
import Aux from "../Aux/Aux";
import Modal from "../../components/UI/Modal/Modal";

const WithErrorHandler = (WrappedComponent, axios) => {
   return class extends React.Component {
      state = {
         error: null,
      };

      componentWillMount() {
         // clear previous errors
         this.reqInterceptor = axios.interceptors.request.use((req) => {
            this.setState({ error: null });
            return req;
         });

         // set error in state if required
         this.resInterceptor = axios.interceptors.response.use(
            (res) => res,
            (error) => {
               this.setState({ error: error });
            }
         );
      }

      componentWillUnmount() {
         axios.interceptors.request.eject(this.reqInterceptor);
         axios.interceptors.response.eject(this.resInterceptor);
      }

      errorConfirmedHandler = () => {
         this.setState({ error: null });
      };

      render() {
         return (
            <Aux>
               <Modal
                  show={this.state.error}
                  modalClosed={this.errorConfirmedHandler}
               >
                  {this.state.error && this.state.error.message}
               </Modal>
               <WrappedComponent {...this.props} />
            </Aux>
         );
      }
   };
};

export default WithErrorHandler;
