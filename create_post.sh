#!/bin/bash
MD_OUTPUTPATH=./src/routes/blog/posts/
EXTRA_DOC_PATH=./static/post-res/

echo "Enter filename for blog post: "
read POSTNAME

echo "Generating markdown file at $MD_OUTPUTPATH..."
touch $MD_OUTPUTPATH$POSTNAME'.md'

INSERT_TEXT="---"
echo $INSERT_TEXT >> $MD_OUTPUTPATH$POSTNAME'.md'

INSERT_TEXT="title: Blog Title Goes Here"
echo $INSERT_TEXT >> $MD_OUTPUTPATH$POSTNAME'.md'

INSERT_TEXT="description: Description goes here"
echo $INSERT_TEXT >> $MD_OUTPUTPATH$POSTNAME'.md'

INSERT_TEXT="created: '2020-01-11T19:45:28.107Z'"
echo $INSERT_TEXT >> $MD_OUTPUTPATH$POSTNAME'.md'

INSERT_TEXT="tags: other"
echo $INSERT_TEXT >> $MD_OUTPUTPATH$POSTNAME'.md'

INSERT_TEXT="---"
echo $INSERT_TEXT >> $MD_OUTPUTPATH$POSTNAME'.md'

INSERT="<!-- more -->"
echo $INSERT_TEXT >> $MD_OUTPUTPATH$POSTNAME'.md'

echo "Generating associated asset folder at $EXTRA_DOC_PATH..."
mkdir $EXTRA_DOC_PATH$POSTNAME