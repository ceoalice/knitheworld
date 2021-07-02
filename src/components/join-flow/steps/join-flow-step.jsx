import classNames  from "classnames";
import React from 'react';
import PropTypes from 'prop-types';

import NextStepButton from '../next-step-button.jsx';
import BodyTitle from '../body-title.jsx';
import BodyInnerContent from '../body-inner-content.jsx';

import styles from './join-flow-step.scss';

const JoinFlowStep = ({
    children,
    innerClassName,
    description,
    descriptionClassName,
    footerContent,
    headerImgClass,
    headerImgSrc,
    nextButton,
    onSubmit,
    step,
    title,
    titleClassName,
    waiting
}) => (
    <form
        autoComplete="off"
        onSubmit={onSubmit}
    >
        <div className={styles["join-flow-outer-content"]}>
            {headerImgSrc && (
                <div
                    className={classNames(
                        styles['join-flow-header-image-wrapper'],
                        headerImgClass
                    )}
                >
                    <img
                        className={styles["join-flow-header-image"]}
                        src={headerImgSrc}
                    />
                </div>
            )}
            <div>
                <BodyInnerContent
                    className={classNames(
                        styles['join-flow-inner-content'],
                        innerClassName
                    )}
                >
                    {title && (
                        <BodyTitle
                            className={classNames(
                                styles['join-flow-title'],
                                titleClassName
                            )}
                            title={title}
                        />
                    )}
                    {description && (
                        <div
                            className={classNames(
                              styles['join-flow-description'],
                                descriptionClassName
                            )}
                        >
                            {description}
                        </div>
                    )}
                    {children}
                </BodyInnerContent>
            </div>
            <div>
                {footerContent && (
                    <div className={styles["join-flow-footer-message"]}>
                        {footerContent}
                    </div>
                )}
                <NextStepButton
                    step={step}
                    content={nextButton}
                    waiting={waiting}
                />
            </div>
        </div>
    </form>
);

JoinFlowStep.propTypes = {
    children: PropTypes.node,
    description: PropTypes.string,
    descriptionClassName: PropTypes.string,
    footerContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    headerImgClass: PropTypes.string,
    headerImgSrc: PropTypes.string,
    innerClassName: PropTypes.string,
    nextButton: PropTypes.node,
    onSubmit: PropTypes.func,
    step: PropTypes.number,
    title: PropTypes.string,
    titleClassName: PropTypes.string,
    waiting: PropTypes.bool
};

export default JoinFlowStep;
