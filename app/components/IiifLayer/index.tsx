/**
 *
 * IiifLayer
 *
 */

import { withLeaflet, MapLayer } from 'react-leaflet';
import Iiif from './LeafletLayer';

class IiifLayer extends MapLayer<any, Iiif> {
  public createLeafletElement(props) {
    return new (Iiif as any)(props.url, this.getOptions(props));
  }

  public updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
  }
}

export default withLeaflet(IiifLayer);
