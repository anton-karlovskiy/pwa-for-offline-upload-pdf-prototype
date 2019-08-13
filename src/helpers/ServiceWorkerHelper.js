
import { Workbox } from 'workbox-window';
import React, { Component } from 'react';

class ServiceWorkerHelper extends Component {
  state = {
    updateAvailable: false
  };
  
  componentDidMount() {
    /*** Adapted from https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users ***/
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('sw.js');
    
      wb.addEventListener('waiting', (event) => {
        console.log(`A new service worker has installed, but it can't activate until all tabs running the current version have fully unloaded.`);
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
        
        this.skipWaiting = () => event.sw.postMessage({type: 'SKIP_WAITING'});

        this.setState({updateAvailable: true});
      });
    
      wb.register();
    }
  }

  render() {
    const { updateAvailable } = this.state;
    return (
      updateAvailable ? <button onClick={this.skipWaiting}>Click to Update</button> : null
    );
  }
}

export default ServiceWorkerHelper;
