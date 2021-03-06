/**
 *
 * SlideshowCartouche
 *
 */

import * as React from 'react';
import {
  Button,
  Card,
  Content,
  Level,
  Column,
  Columns,
  Icon,
  Title,
  ModalCard,
  StretchedLayoutContainer,
  StretchedLayoutItem,
} from 'quinoa-design-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';

import { FormattedMessage } from 'react-intl';
import Slideshow from 'types/Slideshow';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUrl } from 'utils/hooks';
import { displayDate } from 'utils/index';
import { push } from 'connected-react-router';

import messages from './messages';

import './style.css';

const InlineIcon = ({ children }) => (
  <span style={{ marginLeft: '.5rem', marginRight: '1rem' }}>
    <Icon isSize="small">{children}</Icon>
  </span>
);

interface OwnProps {
  slideshow: Slideshow;
  onDelete: (toDelete) => void;
  onDuplicate: (toDuplicate: Slideshow) => void;
}

const useOnAction = (
  slideshow: Slideshow,
  onDelete: (slideshow: Slideshow) => void,
  onDuplicate: (slideshow: Slideshow) => void,
) => {
  const dispatch = useDispatch();
  const goToEditor = React.useCallback(() => dispatch(push(`/editor/${slideshow.id}`)), [slideshow]);
  const goToPlayer = React.useCallback(() => dispatch(push(`/player/${slideshow.id}`)), [slideshow]);

  const [removing, setRemoving] = React.useState<boolean>(false);
  const [isPendingToDelete, setPendingToDelete] = React.useState<boolean>(false);

  const onRemove = () => {
    setRemoving(true);
    onDelete(slideshow);
    setPendingToDelete(false);
  };

  const onDeleteCancel = () => {
    setPendingToDelete(false);
  };

  const onAction = React.useCallback(
    (id) => {
      switch (id) {
        case 'delete':
          return setPendingToDelete(true);
        case 'open':
          return goToEditor();
        case 'read':
          return goToPlayer();
        case 'duplicate':
            return onDuplicate(slideshow);
      }
    },
    [slideshow],
  );
  return {
    onAction: onAction,
    removing: removing,
    isPendingToDelete: isPendingToDelete,
    onDeleteCancel: onDeleteCancel,
    onRemove: onRemove,
  };
};

const SlideshowCartouche: React.SFC<OwnProps> = (props: OwnProps) => {
  const {
    onAction, removing, isPendingToDelete, onDeleteCancel, onRemove,
  } = useOnAction(props.slideshow, props.onDelete, props.onDuplicate);
  const thumbnail = useUrl(props.slideshow.image.file);
  return (
    <Level className="SlideshowCartouche">
      <Column>
        <Card
          onAction={onAction}
          asideActions={[
            {
              label: (
                <span>
                  <InlineIcon>
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </InlineIcon>
                  edit
                </span>
              ),
              isDisabled: removing,
              isColor: 'primary',
              id: 'open',
            },
            {
              label: (
                <span>
                  <InlineIcon>
                    <FontAwesomeIcon icon={faEye} />
                  </InlineIcon>
                  preview
                </span>
              ),
              isDisabled: removing,
              id: 'read',
            },
            {
              label: (
                <span>
                  <InlineIcon>
                    <FontAwesomeIcon icon={faCopy} />
                  </InlineIcon>
                  duplicate
                </span>
              ),
              isDisabled: removing,
              id: 'duplicate',
            },
            {
              label: (
                <span>
                  <InlineIcon>
                    <FontAwesomeIcon icon={faTrash} />
                  </InlineIcon>
                  delete
                </span>
              ),
              isDisabled: removing,
              isColor: 'warning',
              id: 'delete',
            },
          ]}
          bodyContent={
            <Link to={`/editor/${props.slideshow.id}`}>
              <Columns>
                <Column
                  isSize={'1/3'}
                  className="thumbnail-container"
                  >
                  <img
                    src={thumbnail}
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </Column>
                <Column isSize="2/3">
                  <Title isSize={4}>
                    <b>{props.slideshow.name}</b>
                  </Title>
                  <Content className="stats-info">
                    <p className="annotations-container">
                      <span className="annotations-number">
                        {props.slideshow.annotations.size}
                      </span>{' '}
                      annotation
                      {props.slideshow.annotations.size === 1 ? '' : 's'}
                    </p>
                  </Content>
                  <Content isSize={'small'} className={'dates-info'}>
                      {'creation '}{displayDate(props.slideshow.meta.createdAt)}
                      <br />
                      {'last edition '}{displayDate(props.slideshow.meta.updatedAt)}
                  </Content>
                </Column>
              </Columns>
            </Link>
          }
        >
          <Columns>
            <Column>
              <FormattedMessage {...messages.header} />
            </Column>
          </Columns>
        </Card>
      </Column>
      <ModalCard
        isActive={isPendingToDelete}
        onClose={onDeleteCancel}
        headerContent="Deleting an image"
        mainContent="Are you sure you want to delete this image ?"
        footerContent={[
        <StretchedLayoutContainer
            style={{ width: '100%' }}
            isDirection="horizontal"
            key={0}
          >
            <StretchedLayoutItem isFlex={1}>
              <Button isFullWidth onClick={onRemove} isColor="danger">
                Delete
              </Button>
            </StretchedLayoutItem>
            <StretchedLayoutItem isFlex={1}>
              <Button isFullWidth onClick={onDeleteCancel} isColor="warning">
                Cancel
              </Button>
            </StretchedLayoutItem>
          </StretchedLayoutContainer>,
        ]
      }
      />
    </Level>
  );
};

export default SlideshowCartouche;
