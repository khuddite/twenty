import { createReactBlockSpec } from '@blocknote/react';
import styled from '@emotion/styled';
import { isNonEmptyString } from '@sniptt/guards';
import { ChangeEvent, useRef } from 'react';

import { AppThemeProviderEffect } from '@/ui/theme/components/AppThemeProvider';
import { Button } from 'twenty-ui';
import { isDefined } from '~/utils/isDefined';
import { isUndefinedOrNull } from '~/utils/isUndefinedOrNull';

import { BaseThemeProvider } from '@/ui/theme/components/BaseThemeProvider';
import { AttachmentIcon } from '../../files/components/AttachmentIcon';
import { AttachmentType } from '../../files/types/Attachment';
import { getFileType } from '../../files/utils/getFileType';

const StyledFileInput = styled.input`
  display: none;
`;

const StyledFileLine = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledLink = styled.a`
  align-items: center;
  color: ${({ theme }) => theme.font.color.primary};
  display: flex;
  text-decoration: none;
  :hover {
    color: ${({ theme }) => theme.font.color.secondary};
  }
`;

const StyledUploadFileContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const FileBlock = createReactBlockSpec(
  {
    type: 'file',
    propSchema: {
      url: {
        default: '' as string,
      },
      name: {
        default: '' as string,
      },
      fileType: {
        default: 'Other' as AttachmentType,
      },
    },
    content: 'none',
  },
  {
    render: ({ block, editor }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const inputFileRef = useRef<HTMLInputElement>(null);

      const handleUploadAttachment = async (file: File) => {
        if (isUndefinedOrNull(file)) {
          return '';
        }
        const fileUrl = await editor.uploadFile?.(file);

        if (!isNonEmptyString(fileUrl)) {
          return '';
        }

        editor.updateBlock(block.id, {
          props: {
            ...block.props,
            ...{
              url: fileUrl,
              fileType: getFileType(file.name),
              name: file.name,
            },
          },
        });
      };
      const handleUploadFileClick = () => {
        inputFileRef?.current?.click?.();
      };
      const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (isDefined(e.target.files))
          handleUploadAttachment?.(e.target.files[0]);
      };

      if (isNonEmptyString(block.props.url)) {
        return (
          <BaseThemeProvider>
            <AppThemeProviderEffect />
            <StyledFileLine>
              <AttachmentIcon
                attachmentType={block.props.fileType as AttachmentType}
              ></AttachmentIcon>
              <StyledLink href={block.props.url} target="__blank">
                {block.props.name}
              </StyledLink>
            </StyledFileLine>
          </BaseThemeProvider>
        );
      }

      return (
        <BaseThemeProvider>
          <AppThemeProviderEffect />
          <StyledUploadFileContainer>
            <StyledFileInput
              ref={inputFileRef}
              onChange={handleFileChange}
              type="file"
            />
            <Button
              onClick={handleUploadFileClick}
              title="Upload File"
            ></Button>
          </StyledUploadFileContainer>
        </BaseThemeProvider>
      );
    },
  },
);
