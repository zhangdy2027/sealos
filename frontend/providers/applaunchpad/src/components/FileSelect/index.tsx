import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/useToast';
import { Box, Flex, Icon, Text, type BoxProps } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useCallback, useRef, useState } from 'react';

interface Props extends BoxProps {
  fileExtension: string;
  files: File[];
  multiple?: boolean;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileSelect = ({ fileExtension, setFiles, multiple = false, files, ...props }: Props) => {
  const { Loading: FileSelectLoading } = useLoading();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const SelectFileDom = useRef<HTMLInputElement>(null);

  const onSelectFile = useCallback(
    async (files: File[]) => {
      setSelecting(true);
      try {
        setFiles(files);
      } catch (e) {
        console.log('select file error: ', e);
      }
      setSelecting(false);
    },

    [setFiles]
  );

  return (
    <Flex
      mt="24px"
      position={'relative'}
      bg={'#f4f6f8'}
      justifyContent={'center'}
      alignItems={'center'}
      h="132px"
      borderRadius={'4px'}
      border={'1px solid #DEE0E2'}
    >
      <Icon w="24px" h="24px" fill={'#1D8CDC'}>
        <path d="M11 19.7908V13.7908H5V11.7908H11V5.79077H13V11.7908H19V13.7908H13V19.7908H11Z" />
      </Icon>
      <Text
        color={'#1D8CDC'}
        fontSize={'16px'}
        fontWeight={600}
        cursor={'pointer'}
        onClick={() => SelectFileDom.current && SelectFileDom.current.click()}
      >
        {t('upload_file_tip')}
      </Text>
      <Box
        w={'auto'}
        maxW={'366px'}
        h="35px"
        bottom={'0'}
        right={'0'}
        fontWeight={400}
        fontSize={'14px'}
        overflowY={'scroll'}
        position={'absolute'}
      >
        {files.map((item) => (
          <Flex alignItems={'center'} key={item.name}>
            {item.name}
            <Icon
              ml="auto"
              w="24px"
              h="24px"
              fill="#5A646E"
              cursor={'pointer'}
              onClick={() => {
                setFiles((state) => state.filter((file) => file.name !== item.name));
              }}
            >
              <path d="M9.375 18.0408C9.05417 18.0408 8.77961 17.9266 8.55133 17.6984C8.32267 17.4697 8.20833 17.1949 8.20833 16.8741V9.29077H7.625V8.1241H10.5417V7.54077H14.0417V8.1241H16.9583V9.29077H16.375V16.8741C16.375 17.1949 16.2609 17.4697 16.0326 17.6984C15.8039 17.9266 15.5292 18.0408 15.2083 18.0408H9.375ZM15.2083 9.29077H9.375V16.8741H15.2083V9.29077ZM10.5417 15.7074H11.7083V10.4574H10.5417V15.7074ZM12.875 15.7074H14.0417V10.4574H12.875V15.7074ZM9.375 9.29077V16.8741V9.29077Z" />
            </Icon>
          </Flex>
        ))}
      </Box>
      <FileSelectLoading loading={selecting} fixed={false} />
      <Box position={'absolute'} w={0} h={0} overflow={'hidden'}>
        <input
          ref={SelectFileDom}
          type="file"
          accept={fileExtension}
          multiple={multiple}
          onChange={(e) => {
            if (!e.target.files || e.target.files?.length === 0) return;
            if (e.target.files.length > 10) {
              return toast({
                status: 'warning',
                title: t('Select a maximum of 10 files')
              });
            }
            onSelectFile(Array.from(e.target.files));
          }}
        />
      </Box>
    </Flex>
  );
};

export default FileSelect;
