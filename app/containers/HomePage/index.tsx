/**
 *
 * HomePage
 *
 */

import React, { useCallback } from 'react';
import { Button,
  Columns,
  Column,
  Content,
  Container,
  DropZone,
  Footer,
  Title,
  Notification,
} from 'quinoa-design-library';
import { connect, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { toastr } from 'react-redux-toastr/lib';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { propSatisfies, pipe, __, includes, head } from 'ramda';

import { ContainerState } from './types';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSlideshows from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './styles.css';
import {
  createSlideshowAction,
  removeSlideshowAction,
  duplicationSlideshowAction } from './actions';

import SlideshowCartouche from 'components/SlideshowCartouche';

import { useSlicerState } from 'containers/App/hooks';

import medialabLogo from './assets/logo-medialab.svg';
import forccastLogo from './assets/logo-forccast.svg';
import appLogo from './assets/logo.svg';
import Slideshow from 'types/Slideshow';
import { importSlideshowAction } from 'containers/App/actions';
import Loader from 'containers/App/Loader';
import { useVideoModale } from 'components/Modal';

interface HomePageProps {
  createSlideshow: (file: File) => void;
  duplicateSlideshow: (slideshow: Slideshow) => void;
  importSlideshow: (file: File) => void;
}

const acceptedImages = [
  'image/svg+xml',
  'image/jpeg',
  'image/png',
  'image/bmp',
  'image/webp',
];

const acceptedApp = ['application/zip'];

const acceptedFiles = [...acceptedImages, ...acceptedApp];

const validateImageTypes: (File) => boolean = propSatisfies(
  includes(__, acceptedImages),
  'type',
);

const validateImportTypes: (File) => boolean = propSatisfies(
  includes(__, acceptedApp),
  'type',
);

function HomePage(props: HomePageProps & ContainerState) {
  const dispatch = useDispatch();
  const slicer = useSlicerState();
  const onDrop = useCallback((files: File[]) => {
    const file = head(files);
    if (!file) {
      toastr.error(`Invalid file extension`, 'You tried to import a file which are not handled by Tesselle.');
    } else if (validateImageTypes(file)) {
      return props.createSlideshow(file);
    } else if (validateImportTypes(file)) {
      return props.importSlideshow(file);
    } else {
      toastr.error(
        `Tesselle could not import the file ${file.name}`,
        'It can be due to corrupted data or to insufficient disk space.',
      );
    }
  }, [props.createSlideshow, props.importSlideshow]);
  const onDelete = useCallback(pipe(removeSlideshowAction.request, dispatch), []);
  const [opener, modale] = useVideoModale({
    title: 'Video overview',
    vimeoIds: ['372868240'],
  });
  return (
    <>
      <Container className="home-container">
        <Helmet>
          <title>
            Tesselle
          </title>
          <meta name="description" content="An image annotation and publishing tool" />
        </Helmet>
        <Columns>
          <Column className="aside-column" isSize={'1/3'}>
            <Content>
              <Title className="app-title" isSize={1}>
                <img src={appLogo} />
                <span>Tesselle</span>
              </Title>
              <p><FormattedMessage {...messages.chapo} /></p>
              <Button isFullWidth isColor="primary" onClick={opener}>Video overview</Button>
              {modale}
            </Content>
            {slicer.total === 0
              ? <DropZone
                  accept={acceptedFiles.join(',')}
                  onDrop={onDrop}
                >
                  {
                    (props as any).loading ?
                    'Loading...'
                    :
                    'Drop an image file (.jpg, .png, or .svg) or a tesselle project (.zip)'
                  }
                </DropZone>
              : <Loader />
              }
          </Column>
          <Column isSize={'2/3'} className="cards-column">
            <div className="list-projects__container">
              <h4 className="list-projects__title title is-2">
                Your images
              </h4>
              <ul className="cards-container">
                {props.slideshows.size ?
                  props.slideshows.map(slideshow => (
                    <li className="card-wrapper" key={slideshow.id}>
                      <SlideshowCartouche
                        onDelete={onDelete}
                        slideshow={slideshow}
                        onDuplicate={props.duplicateSlideshow} />
                    </li>
                  ))
                  :
                  <>
                    <Notification style={{marginTop: '2rem'}} isColor="primary">
                      <Title>
                        {`Welcome to Tesselle, `}
                        <a
                          target="blank"
                          rel="noopener"
                          href="https://medialab.sciencespo.fr"
                        >médialab</a>'s
                        {` image annotation and publication tool`}
                      </Title>
                      <Content>
                        All the data you will input in this tool will be stored in this browser local storage
                        and therefore stay entirely private.
                      </Content>
                      <Content>
                        You have no image projects on this browser yet.
                        Drag and drop an image in the left column box to start annotating !
                      </Content>
                    </Notification>
                  </>
                }
              </ul>
            </div>
          </Column>
        </Columns>
      </Container>
      <Footer id={'footer'}>
        <Container>
          <Columns>
            <Column className="logos-column" isSize={'1/3'}>
              <div>
                <a
                  target={'blank'}
                  href={'http://controverses.org/'}
                >
                  <img
                    className="logo-img"
                    src={forccastLogo}
                  />
                </a>
                <a
                  target={'blank'}
                  href={'https://medialab.sciencespo.fr'}
                >
                  <img
                    className="logo-img"
                    src={medialabLogo}
                  />
                </a>
              </div>
            </Column>
            <Column isSize={'2/3'} className="about-column">
              <Content
                style={{ paddingLeft: '1rem' }}
                isSize={'small'}
              >
                <p>
                  {`Provided by the `}
                  <a target="blank" href="http://controverses.org/">FORCCAST</a>
                  {` program, fostering pedagogical innovations in controversy mapping.`}
                </p>
                <p>
                  {`Made at the `}
                  <a target="blank" href="http://medialab.sciencespo.fr/">médialab SciencesPo</a>
                  {`, a research laboratory that connects social sciences with inventive methods.`}
                </p>
                <p>
                  {`The source code of Tesselle is licensed under free software license `}
                  <a
                    target={'blank'}
                    href={'http://www.gnu.org/licenses/agpl-3.0.html'}
                  >AGPL v3</a>
                  {` and is hosted on `}
                  <a
                    target={'blank'}
                    href={'https://github.com/medialab/tesselle/'}
                  >Github</a>.
                </p>
              </Content>
            </Column>
          </Columns>
      </Container>
    </Footer>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  slideshows: makeSelectSlideshows(),
});

const withConnect = connect(
  mapStateToProps,
  {
    createSlideshow: createSlideshowAction.request,
    duplicateSlideshow: duplicationSlideshowAction,
    importSlideshow: importSlideshowAction.request,
  },
);

const withReducer = injectReducer({ key: 'homePage', reducer: reducer });
const withSaga = injectSaga({ key: 'homePage', saga: saga });

export const enhancer = compose(
  withReducer,
  withSaga,
  withConnect,
);

export default enhancer(HomePage);
